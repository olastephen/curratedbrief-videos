import type { BriefProps } from "../types";

export const automateThis: BriefProps = {
  theme: "automation",
  category: "Automation",
  scenes: [
    { type: "headline", seconds: 3.4, text: "One blog post. Every channel. Zero clicks." },
    {
      type: "flow", seconds: 6.2,
      steps: [
        { title: "Post goes live", note: "WordPress" },
        { title: "Make picks it up", note: "Watches for new posts" },
      ],
      split: [
        { title: "X", note: "Video + thread" },
        { title: "LinkedIn", note: "Native post" },
      ],
    },
    { type: "tip", seconds: 3.8, label: "The LinkedIn trick", text: "Put the link in the first comment, not the post." },
    { type: "tip", seconds: 3.8, label: "The X trick", text: "Upload the video natively. Link goes in a reply." },
    { type: "end", seconds: 3.6, line: "Follow for more automations." },
  ],
};
