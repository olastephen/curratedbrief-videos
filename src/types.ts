export type ThemeName = "news" | "numbers" | "automation";

type Timed = { seconds: number };

export type Scene = Timed &
  (
    | { type: "headline"; text: string; sub?: string }
    | { type: "count"; value: number; decimals?: number; prefix?: string; suffix?: string; text: string }
    | { type: "timeline"; title: string; items: { when: string; what: string }[] }
    | { type: "quote"; place?: string; quote: string; cite: string }
    | { type: "lesson"; text: string; highlight: string; fine?: string }
    | { type: "bars"; title: string; rows: { label: string; note?: string; value: number; decimals?: number }[] }
    | { type: "flow"; steps: { title: string; note?: string }[]; split?: { title: string; note?: string }[] }
    | { type: "tip"; label: string; text: string }
    | { type: "end"; line: string }
  );

export type BriefProps = {
  theme: ThemeName;
  /** Shown in the category pill at the top, like the tags on the site */
  category: string;
  scenes: Scene[];
};
