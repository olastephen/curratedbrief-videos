import React from "react";
import { Composition, staticFile, type CalculateMetadataFunction } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./brand";
import { Brief, MUSIC_FILE, sceneFrames } from "./Brief";
import { automateThis } from "./data/automateThis";
import { byTheNumbers } from "./data/byTheNumbers";
import { dailyBrief } from "./data/dailyBrief";
import type { BriefProps } from "./types";

// Background music plays only if public/music.mp3 has been added, so a missing file never breaks a render
const musicExists = () =>
  fetch(staticFile(MUSIC_FILE), { method: "HEAD" }).then((r) => r.ok, () => false);

// Length is worked out from the scenes, so new props files never need a duration
const calculateMetadata: CalculateMetadataFunction<BriefProps> = async ({ props }) => ({
  durationInFrames: props.scenes.reduce((sum, s) => sum + sceneFrames(s.seconds), 0),
  props: { ...props, hasMusic: await musicExists() },
});

const shared = { component: Brief, fps: FPS, width: WIDTH, height: HEIGHT, durationInFrames: 900, calculateMetadata };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="DailyBrief" {...shared} defaultProps={dailyBrief} />
    <Composition id="ByTheNumbers" {...shared} defaultProps={byTheNumbers} />
    <Composition id="AutomateThis" {...shared} defaultProps={automateThis} />
  </>
);
