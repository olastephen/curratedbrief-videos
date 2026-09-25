import { loadFont } from "@remotion/google-fonts/Rubik";
import type { ThemeName } from "./types";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "700", "800", "900"],
  subsets: ["latin"],
});

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Sampled from the CurratedBrief logo, icon and category tags */
export const BRAND = {
  red: "#FF3131",
  black: "#000000",
  white: "#FFFFFF",
  green: "#81D742", // category tag
  blue: "#1E73BE", // category tag
};

export type Theme = {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  track: string;
  tag: string;
  tagText: string;
  down: string;
  up: string;
  nodeBg: string;
  nodeFg: string;
};

export const THEMES: Record<ThemeName, Theme> = {
  // Daily brief: the logo's black, white and lightning red
  news: {
    bg: BRAND.black, fg: BRAND.white, accent: BRAND.red, muted: "#A6A6A6",
    track: "rgba(255,255,255,0.22)", tag: BRAND.red, tagText: BRAND.white,
    down: BRAND.red, up: BRAND.green, nodeBg: BRAND.white, nodeFg: BRAND.black,
  },
  // By the numbers: white page, blue category colour, red/green for market moves
  numbers: {
    bg: BRAND.white, fg: BRAND.black, accent: BRAND.blue, muted: "#5F5F5F",
    track: "rgba(0,0,0,0.1)", tag: BRAND.blue, tagText: BRAND.white,
    down: BRAND.red, up: "#5FAE24", nodeBg: BRAND.black, nodeFg: BRAND.white,
  },
  // Automate this: the green category colour as the whole background
  automation: {
    bg: BRAND.green, fg: BRAND.black, accent: BRAND.black, muted: "#2F4D18",
    track: "rgba(0,0,0,0.18)", tag: BRAND.black, tagText: BRAND.white,
    down: BRAND.red, up: BRAND.black, nodeBg: BRAND.black, nodeFg: BRAND.white,
  },
};

/** Keep text clear of TikTok/Reels/Shorts buttons (right edge, bottom) */
export const SAFE = { top: 300, left: 90, right: 150, bottom: 340 };
