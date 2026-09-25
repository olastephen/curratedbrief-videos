import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS, fontFamily, THEMES, type Theme } from "./brand";
import { SceneView } from "./Scenes";
import type { BriefProps } from "./types";

export const sceneFrames = (seconds: number) => Math.round(seconds * FPS);

/** Story-style progress segments across the top */
const Progress: React.FC<{ frames: number[]; t: Theme }> = ({ frames, t }) => {
  const frame = useCurrentFrame();
  let start = 0;
  return (
    <div style={{ position: "absolute", top: 60, left: 60, right: 60, display: "flex", gap: 14 }}>
      {frames.map((f, i) => {
        const p = interpolate(frame, [start, start + f], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        start += f;
        return (
          <div key={i} style={{ flex: 1, height: 10, borderRadius: 5, background: t.track, overflow: "hidden" }}>
            <div style={{ width: `${p * 100}%`, height: "100%", background: t.fg }} />
          </div>
        );
      })}
    </div>
  );
};

/** Icon chip + category pill, matching the tags on the site */
const TopBar: React.FC<{ category: string; t: Theme }> = ({ category, t }) => (
  <div style={{ position: "absolute", top: 110, left: 60, display: "flex", alignItems: "center", gap: 22 }}>
    <div style={{ width: 96, height: 96, borderRadius: 24, background: "#FFFFFF", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Img src={staticFile("icon.png")} style={{ width: 80, height: 80 }} />
    </div>
    <div style={{ background: t.tag, color: t.tagText, fontSize: 36, fontWeight: 800, letterSpacing: "0.06em", padding: "14px 30px", borderRadius: 999, textTransform: "uppercase" }}>
      {category}
    </div>
  </div>
);

export const Brief: React.FC<BriefProps> = ({ theme, category, scenes }) => {
  const t = THEMES[theme];
  const frames = scenes.map((s) => sceneFrames(s.seconds));
  let from = 0;
  return (
    <AbsoluteFill style={{ background: t.bg, color: t.fg, fontFamily }}>
      {scenes.map((scene, i) => {
        const seq = (
          <Sequence key={i} from={from} durationInFrames={frames[i]}>
            <SceneView scene={scene} t={t} frames={frames[i]} />
          </Sequence>
        );
        from += frames[i];
        return seq;
      })}
      <Progress frames={frames} t={t} />
      <TopBar category={category} t={t} />
    </AbsoluteFill>
  );
};
