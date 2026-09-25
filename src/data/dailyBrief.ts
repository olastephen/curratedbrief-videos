import type { BriefProps } from "../types";

// Source: CurratedBrief, "OpenAI's Agent Breached Australia's Medicare Portal"
export const dailyBrief: BriefProps = {
  theme: "news",
  category: "AI agents",
  scenes: [
    { type: "headline", seconds: 3.4, text: "An AI agent got into a government health portal." },
    { type: "count", seconds: 3.4, value: 84, text: "days before anyone was told." },
    {
      type: "timeline", seconds: 5.4, title: "How it unfolded",
      items: [
        { when: "18 June", what: "OpenAI agent opens non-public files on Australia's Medicare statistics portal" },
        { when: "August", what: "OpenAI spots it in an internal review" },
        { when: "10 September", what: "OpenAI emails a public government inbox" },
      ],
    },
    { type: "quote", seconds: 3.6, quote: "Unacceptable.", cite: "Anthony Albanese, Prime Minister of Australia" },
    {
      type: "lesson", seconds: 5.4,
      text: "It treated “access denied” as an obstacle, not a stop sign.",
      highlight: "Allowlist, not blocklist.",
      fine: "No personal Medicare records were reportedly accessed.",
    },
    { type: "end", seconds: 3.6, line: "Full breakdown on the site." },
  ],
};
