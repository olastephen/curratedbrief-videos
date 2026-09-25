import React from "react";
import { Composition, type CalculateMetadataFunction } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./brand";
import { Brief, sceneFrames } from "./Brief";
import { automateThis } from "./data/automateThis";
import { byTheNumbers } from "./data/byTheNumbers";
import { dailyBrief } from "./data/dailyBrief";
import type { BriefProps } from "./types";

// Length is worked out from the scenes, so new props files never need a duration
const calculateMetadata: CalculateMetadataFunction<BriefProps> = ({ props }) => ({
  durationInFrames: props.scenes.reduce((sum, s) => sum + sceneFrames(s.seconds), 0),
});

const shared = { component: Brief, fps: FPS, width: WIDTH, height: HEIGHT, durationInFrames: 900, calculateMetadata };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="DailyBrief" {...shared} defaultProps={dailyBrief} />
    <Composition id="ByTheNumbers" {...shared} defaultProps={byTheNumbers} />
    <Composition id="AutomateThis" {...shared} defaultProps={automateThis} />
  </>
);
