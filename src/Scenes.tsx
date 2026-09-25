import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SAFE, type Theme } from "./brand";
import { CountUp, Grow, In, Pop, Wipe } from "./Motion";
import type { Scene } from "./types";

const type = {
  h1: { fontSize: 112, lineHeight: 1.02, fontWeight: 900, letterSpacing: "-0.02em", margin: 0 },
  h2: { fontSize: 76, lineHeight: 1.12, fontWeight: 800, letterSpacing: "-0.01em", margin: 0 },
  label: { fontSize: 58, fontWeight: 800, margin: 0 },
  cite: { fontSize: 46, lineHeight: 1.35, fontWeight: 500, margin: 0 },
  fine: { fontSize: 40, lineHeight: 1.4, fontWeight: 500, margin: 0 },
  quote: { fontSize: 158, lineHeight: 0.95, fontWeight: 900, letterSpacing: "-0.03em", margin: 0 },
} satisfies Record<string, React.CSSProperties>;

const Layout: React.FC<{ children: React.ReactNode; center?: boolean }> = ({ children, center }) => (
  <AbsoluteFill
    style={{
      padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: center ? "center" : "flex-start",
      textAlign: center ? "center" : "left",
      gap: 48,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Fades each scene out over its last few frames so cuts feel smooth */
export const SceneView: React.FC<{ scene: Scene; t: Theme; frames: number }> = ({ scene, t, frames }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [frames - 7, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: out }}>{render(scene, t)}</AbsoluteFill>;
};

function render(s: Scene, t: Theme): React.ReactNode {
  switch (s.type) {
    case "headline":
      return (
        <Layout>
          <In><h1 style={type.h1}>{s.text}</h1></In>
          {s.sub && <In delay={18}><p style={{ ...type.h2, color: t.accent }}>{s.sub}</p></In>}
        </Layout>
      );

    case "count":
      return (
        <Layout>
          <Pop>
            <div style={{ fontSize: 500, lineHeight: 0.82, fontWeight: 900, letterSpacing: "-0.05em", color: t.accent }}>
              <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
            </div>
          </Pop>
          <In delay={16}><p style={type.h2}>{s.text}</p></In>
        </Layout>
      );

    case "timeline":
      return (
        <Layout>
          <In><p style={{ ...type.label, color: t.muted }}>{s.title}</p></In>
          <div style={{ position: "relative", paddingLeft: 70, display: "flex", flexDirection: "column", gap: 60 }}>
            <Grow axis="y" delay={6} style={{ position: "absolute", left: 13, top: 18, bottom: 18, width: 8, background: t.track, borderRadius: 8 }} />
            {s.items.map((item, i) => (
              <In key={i} delay={10 + i * 30} style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: -70, top: 14, width: 34, height: 34, borderRadius: 17, background: t.accent }} />
                <div style={{ fontSize: 64, fontWeight: 900 }}>{item.when}</div>
                <div style={{ ...type.cite, color: t.muted, marginTop: 8 }}>{item.what}</div>
              </In>
            ))}
          </div>
        </Layout>
      );

    case "quote":
      return (
        <Layout>
          {s.place && <In><p style={{ ...type.label, color: t.accent }}>{s.place}</p></In>}
          <Wipe delay={s.place ? 12 : 0}><p style={type.quote}>“{s.quote}”</p></Wipe>
          <In delay={28}><p style={{ ...type.cite, color: t.muted }}>{s.cite}</p></In>
        </Layout>
      );

    case "lesson":
      return (
        <Layout>
          <In><p style={type.h2}>{s.text}</p></In>
          <In delay={42}>
            <p style={{ ...type.h1, fontSize: 96, color: t.bg, background: t.accent, padding: "18px 30px", borderRadius: 24, display: "inline-block" }}>
              {s.highlight}
            </p>
          </In>
          {s.fine && <In delay={70}><p style={{ ...type.fine, color: t.muted }}>{s.fine}</p></In>}
        </Layout>
      );

    case "bars": {
      const max = Math.max(...s.rows.map((r) => Math.abs(r.value)));
      return (
        <Layout>
          <In><p style={{ ...type.label, color: t.accent }}>{s.title}</p></In>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 50 }}>
            {s.rows.map((r, i) => {
              const colour = r.value < 0 ? t.down : t.up;
              const d = 8 + i * 12;
              return (
                <In key={i} delay={d}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                    <span style={{ fontSize: 50, fontWeight: 800 }}>
                      {r.label}
                      {r.note && <span style={{ fontSize: 38, fontWeight: 500, color: t.muted, marginLeft: 16 }}>{r.note}</span>}
                    </span>
                    <span style={{ fontSize: 56, fontWeight: 900, color: colour }}>
                      <CountUp value={Math.abs(r.value)} decimals={r.decimals ?? 0} prefix={r.value < 0 ? "−" : "+"} suffix="%" delay={d + 4} />
                    </span>
                  </div>
                  <div style={{ height: 56, borderRadius: 18, background: t.track, overflow: "hidden" }}>
                    <Grow axis="x" delay={d + 4} style={{ height: "100%", width: `${(Math.abs(r.value) / max) * 100}%`, background: colour, borderRadius: 18 }} />
                  </div>
                </In>
              );
            })}
          </div>
        </Layout>
      );
    }

    case "flow": {
      const node = (n: { title: string; note?: string }, center = false): React.ReactNode => (
        <div style={{ background: t.nodeBg, color: t.nodeFg, borderRadius: 34, padding: "36px 44px", textAlign: center ? "center" : "left" }}>
          <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.1 }}>{n.title}</div>
          {n.note && <div style={{ fontSize: 40, fontWeight: 500, opacity: 0.75, marginTop: 8 }}>{n.note}</div>}
        </div>
      );
      const link = (delay: number) => (
        <Grow axis="y" delay={delay} style={{ width: 10, height: 80, background: t.fg, marginLeft: 90, borderRadius: 5 }} />
      );
      let d = 4;
      const items: React.ReactNode[] = [];
      s.steps.forEach((step, i) => {
        items.push(<Pop key={`n${i}`} delay={d} style={{ width: "100%" }}>{node(step)}</Pop>);
        d += 20;
        if (i < s.steps.length - 1 || s.split) {
          items.push(<div key={`l${i}`}>{link(d - 6)}</div>);
          d += 10;
        }
      });
      if (s.split) {
        items.push(
          <div key="split" style={{ display: "grid", gridTemplateColumns: `repeat(${s.split.length}, 1fr)`, gap: 30, width: "100%" }}>
            {s.split.map((n, i) => (
              <Pop key={i} delay={d + i * 12}>{node(n, true)}</Pop>
            ))}
          </div>
        );
      }
      return (
        <Layout>
          <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>{items}</div>
        </Layout>
      );
    }

    case "tip":
      return (
        <Layout>
          <In><p style={{ ...type.label, color: t.accent === t.fg ? t.muted : t.accent }}>{s.label}</p></In>
          <In delay={12}><h1 style={type.h1}>{s.text}</h1></In>
        </Layout>
      );

    case "end":
      return (
        <Layout center>
          <Pop style={{ transformOrigin: "center" }}>
            <Img src={staticFile("logo.png")} style={{ width: 900 }} />
          </Pop>
          <In delay={16}><p style={{ ...type.h2, fontSize: 64 }}>{s.line}</p></In>
          <In delay={28}>
            <p style={{ fontSize: 44, fontWeight: 800, letterSpacing: "0.12em", background: t.fg, color: t.bg, padding: "18px 36px", borderRadius: 14, margin: 0 }}>
              CURRATEDBRIEF.COM
            </p>
          </In>
        </Layout>
      );
  }
}
