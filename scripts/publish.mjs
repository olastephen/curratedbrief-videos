// Posts the rendered video to YouTube, LinkedIn, Instagram, TikTok and X through Postiz.
// Runs in GitHub Actions after the render step (see .github/workflows/main.yml).
//
// Needs these repository secrets / variables:
//   POSTIZ_API_URL  e.g. https://postiz-u39275.vm.elestio.app/api   (secret)
//   POSTIZ_API_KEY  from Postiz Settings -> Public API                  (secret)
//   POST_MODE       "draft" (default: lands in Postiz for you to approve) or "schedule" (goes live)  (variable)
// And from the workflow: SOURCE_URL (the article), VIDEO (path to the MP4).

import { readFile } from "node:fs/promises";

const API = (process.env.POSTIZ_API_URL || "").replace(/\/+$/, "");
const KEY = process.env.POSTIZ_API_KEY || "";
const MODE = process.env.POST_MODE === "schedule" ? "schedule" : "draft";
const VIDEO = process.env.VIDEO || "out/today.mp4";
const SOURCE_URL = process.env.SOURCE_URL || "";

if (!API || !KEY) {
  console.log("Postiz secrets not set, so skipping social posting. The video is still in the run's artifacts.");
  process.exit(0);
}

// Which Postiz channel types count as each platform (Postiz "identifier" values)
const PLATFORMS = {
  youtube: ["youtube"],
  linkedin: ["linkedin", "linkedin-page"],
  instagram: ["instagram", "instagram-standalone"],
  tiktok: ["tiktok"],
  x: ["x"],
};

// ---------- helpers ----------
// Retries each Postiz call up to 3 times (5s, then 15s apart), since the instance can be flaky
const api = async (path, init = {}, attempt = 1) => {
  try {
    return await apiOnce(path, init);
  } catch (e) {
    if (attempt >= 3 || /-> 4(0[0-9]|1[0-9]|2[0-9])(?!8)/.test(e.message) && !/-> 429/.test(e.message)) throw e;
    const wait = attempt === 1 ? 5000 : 15000;
    console.log(`  retrying ${path} in ${wait / 1000}s (${e.message.slice(0, 120)})`);
    await new Promise((r) => setTimeout(r, wait));
    return api(path, init, attempt + 1);
  }
};
const apiOnce = async (path, init = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: KEY, ...(init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}), ...init.headers },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method || "GET"} ${path} -> ${res.status}: ${text.slice(0, 500)}`);
  try { return JSON.parse(text); } catch { return text; }
};

const decode = (s = "") =>
  s.replace(/<[^>]*>/g, " ")
   .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
   .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
   .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'")
   .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&hellip;|\[&hellip;\]/g, "…")
   .replace(/\s+/g, " ").trim();

const cut = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…");

// ---------- 1. article details ----------
async function getArticle() {
  const fallback = { title: "Today's AI brief", excerpt: "", link: SOURCE_URL || "https://curratedbrief.com" };
  if (!SOURCE_URL) return fallback;
  try {
    const u = new URL(SOURCE_URL);
    const slug = u.pathname.split("/").filter(Boolean).pop();
    const res = await fetch(`${u.origin}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_fields=title,excerpt,link`);
    const [post] = await res.json();
    if (!post) return fallback;
    return { title: decode(post.title?.rendered), excerpt: decode(post.excerpt?.rendered), link: post.link || SOURCE_URL };
  } catch (e) {
    console.log("Could not read the article from WordPress, using fallback text:", e.message);
    return fallback;
  }
}

// ---------- 2. captions per platform ----------
function buildPosts(a) {
  const tags = "#AI #AINews #ArtificialIntelligence";
  return {
    // No link at all on X: automated URL posts are expensive on the X API.
    // Add the article link yourself as a reply from the X app, per the CurratedBrief playbook.
    x: {
      value: [cut(a.title, 270)],
      settings: { who_can_reply_post: "everyone" },
    },
    // Link goes in the first comment
    linkedin: {
      value: [`${a.title}\n\n${cut(a.excerpt, 900)}`.trim(), `Full breakdown: ${a.link}`],
      settings: {},
    },
    youtube: {
      value: [`${cut(a.excerpt, 800)}\n\nFull breakdown: ${a.link}\n\n#Shorts ${tags}`.trim()],
      settings: { title: cut(a.title, 95), type: "public" },
    },
    instagram: {
      value: [`${a.title}\n\n${cut(a.excerpt, 900)}\n\nFull breakdown at the link in our bio.\n\n${tags}`.trim()],
      settings: { post_type: "post" },
    },
    tiktok: {
      value: [cut(`${a.title}. Full breakdown at curratedbrief.com ${tags}`, 2000)],
      // DIRECT_POST publishes; "UPLOAD" would only drop it in the TikTok inbox
      settings: { privacy_level: "PUBLIC_TO_EVERYONE", duet: true, stitch: true, content_posting_method: "DIRECT_POST" },
    },
  };
}

// ---------- main ----------
const article = await getArticle();
console.log(`Article: ${article.title}\nLink: ${article.link}\nMode: ${MODE}`);

const integrations = await api("/public/v1/integrations");
const list = Array.isArray(integrations) ? integrations : integrations.integrations || [];
const findChannel = (ids) => list.filter((i) => ids.includes(i.identifier) && !i.disabled);

const buf = await readFile(VIDEO);
const form = new FormData();
form.append("file", new Blob([buf], { type: "video/mp4" }), "curratedbrief.mp4");
const uploaded = await api("/public/v1/upload", { method: "POST", body: form });
console.log("Uploaded video to Postiz:", uploaded.path);

const posts = buildPosts(article);
const date = new Date(Date.now() + 10 * 60 * 1000).toISOString();
let ok = 0, failed = 0, missing = [];

for (const [platform, ids] of Object.entries(PLATFORMS)) {
  const channels = findChannel(ids);
  if (!channels.length) { missing.push(platform); continue; }
  for (const ch of channels) {
    try {
      // Log Postiz's own rules for this channel so they can be checked in the run log
      try {
        const s = await api(`/public/v1/integration-settings/${ch.id}`);
        const rules = s?.output?.rules || s?.rules;
        if (rules) console.log(`[${platform}] Postiz rules: ${typeof rules === "string" ? rules : JSON.stringify(rules)}`);
      } catch {}
      const p = posts[platform];
      const media = [{ id: Math.random().toString(36).slice(2, 9), path: uploaded.path }];
      const value = p.value.map((content, i) => ({ content, image: i === 0 ? media : [], delay: 0 }));
      const res = await api("/public/v1/posts", {
        method: "POST",
        body: JSON.stringify({
          type: MODE, date, shortLink: false, tags: [],
          posts: [{ integration: { id: ch.id }, value, settings: p.settings }],
        }),
      });
      console.log(`[${platform}] ${MODE === "draft" ? "Draft created" : "Scheduled"} on "${ch.name}"`, JSON.stringify(res).slice(0, 200));
      ok++;
    } catch (e) {
      console.log(`[${platform}] FAILED on "${ch.name}": ${e.message}`);
      failed++;
    }
  }
}

if (missing.length) console.log(`Not connected in Postiz, skipped: ${missing.join(", ")}`);
console.log(`Done: ${ok} succeeded, ${failed} failed.`);
if (ok === 0) process.exit(1);
