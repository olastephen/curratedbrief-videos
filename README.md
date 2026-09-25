# CurratedBrief videos (Remotion)

Branded 1080×1920 vertical videos for X, LinkedIn, TikTok, Reels and Shorts.
Colours come from the CurratedBrief logo (black, white, #FF3131 red) and the site's
category tags (#81D742 green, #1E73BE blue). The logo and icon are in `public/`.

## Setup (once)

Needs Node.js 22 (the same version the GitHub Action uses).

    npm install

## Preview and edit

    npm start

This opens Remotion Studio in your browser, where you can scrub through all three videos.

## Render MP4s

    npm run render:daily      # out/daily-brief.mp4
    npm run render:numbers    # out/by-the-numbers.mp4
    npm run render:automate   # out/automate-this.mp4

The first render downloads a headless browser, which takes a minute.

## Render on GitHub (no computer needed)

1. Open the repo on github.com and click the **Actions** tab.
2. In the left sidebar click **Render videos**.
3. Click the **Run workflow** button (right side), pick a video (or `all`), then click the green **Run workflow**.
4. When the run shows a green tick (a few minutes), click it, scroll to **Artifacts** at the bottom and click **videos** to download a zip of the MP4s. Downloads are kept for 14 days.

The workflow file is `.github/workflows/main.yml`.

## Make a new video without touching code

Copy `props/example-today.json`, change the text, then:

    npx remotion render DailyBrief out/today.mp4 --props=./props/today.json

- `theme`: `news` (black/red), `numbers` (white/blue) or `automation` (green)
- `category`: the text in the pill at the top
- Scene types: `headline`, `count`, `timeline`, `quote`, `lesson`, `bars`, `flow`, `tip`, `end`
  (see `src/types.ts` for the fields each one takes, and `src/data/` for full examples)
- The video length is worked out from each scene's `seconds`.

## Daily automation (outline)

1. When a post publishes, Make sends the article to an AI step that returns a props JSON in the format above.
2. Make triggers a GitHub Action (or a small server) that runs `npx remotion render ... --props=...`.
3. The MP4 is uploaded somewhere Postiz or Make can pick it up and post to X and LinkedIn.

## Changing the look

- Colours and themes: `src/brand.ts`
- Font (Rubik): `src/brand.ts`
- Scene layouts: `src/Scenes.tsx`
- Animation feel: `src/Motion.tsx`

## Licence

Remotion is free for individuals and small teams; bigger companies need a company licence.
Check the current terms at remotion.dev/license before commercial use.
