import type { BriefProps } from "../types";

// Source: CurratedBrief, "Amodei's 'Pace the Frontier' Essay Triggers Trump Backlash and a Nvidia Selloff"
export const byTheNumbers: BriefProps = {
  theme: "numbers",
  category: "AI policy",
  scenes: [
    { type: "headline", seconds: 3.4, text: "One essay on slowing AI down.", sub: "Three very different reactions in 24 hours." },
    { type: "quote", seconds: 3.4, place: "Washington", quote: "SICK conspiracy", cite: "Donald Trump on Truth Social, 14 September" },
    { type: "quote", seconds: 3.2, place: "Beijing", quote: "Fearmongering", cite: "China's Foreign Ministry" },
    {
      type: "bars", seconds: 6, title: "Markets",
      rows: [
        { label: "SoftBank", note: "14 Sep", value: -11 },
        { label: "Nvidia", note: "week", value: -8.38, decimals: 2 },
        { label: "ASML", note: "14 Sep", value: -6 },
        { label: "Meta", note: "week", value: 7.12, decimals: 2 },
      ],
    },
    { type: "lesson", seconds: 4.4, text: "But bond yields near 5% did a lot of that damage.", highlight: "Three stories, not one." },
    { type: "end", seconds: 3.6, line: "What the coverage got wrong." },
  ],
};
