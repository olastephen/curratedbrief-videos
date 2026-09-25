import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const useSpring = (delay: number, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, frame - delay), fps, config: { damping } });
};

type P = { delay?: number; style?: React.CSSProperties; children?: React.ReactNode };

/** Slide up and fade in */
export const In: React.FC<P> = ({ delay = 0, style, children }) => {
  const s = useSpring(delay);
  return <div style={{ ...style, opacity: s, transform: `translateY(${(1 - s) * 70}px)` }}>{children}</div>;
};

/** Scale in with a little overshoot */
export const Pop: React.FC<P> = ({ delay = 0, style, children }) => {
  const s = useSpring(delay, 12);
  const o = useSpring(delay);
  return <div style={{ ...style, opacity: o, transform: `scale(${0.6 + 0.4 * s})`, transformOrigin: "left center" }}>{children}</div>;
};

/** Reveal left to right, like a highlighter */
export const Wipe: React.FC<P> = ({ delay = 0, style, children }) => {
  const s = useSpring(delay);
  return <div style={{ ...style, clipPath: `inset(-10% ${(1 - s) * 100}% -10% 0)` }}>{children}</div>;
};

/** Grow a bar or line from zero */
export const Grow: React.FC<P & { axis: "x" | "y" }> = ({ delay = 0, axis, style }) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        ...style,
        transform: axis === "x" ? `scaleX(${s})` : `scaleY(${s})`,
        transformOrigin: axis === "x" ? "left" : "top",
      }}
    />
  );
};

/** Count a number up, easing out */
export const CountUp: React.FC<{
  value: number; delay?: number; decimals?: number; prefix?: string; suffix?: string; duration?: number;
}> = ({ value, delay = 8, decimals = 0, prefix = "", suffix = "", duration = 36 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - p, 3);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {(value * eased).toFixed(decimals)}
      {suffix}
    </span>
  );
};
