import { View } from "react-native";
import type { StoryContent } from "../../storyDraft";
import { Art, ArtistTitle, Eyebrow, F, font, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & { ramp: string[]; blend: "color" | "multiply"; hot: string };

const hexRgb = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16)).join(",");
const withMini = (v: Omit<V, "mini">): V => ({ ...v, mini: { sh: [70, 28, 3, `linear-gradient(90deg, ${v.ramp.join(", ")})`] } });
const variants = (c: StoryContent): [V, V, V] => [
  withMini({
    name: "Infrared",
    bg: "#0B0B14",
    ink: "#F1EFFA",
    sub: "#9A97B0",
    dark: true,
    ramp: ["#140B3D", "#4B0FA8", "#A3157A", "#E8433A", "#FF9F1C", "#FFE45E"],
    blend: "color",
    hot: "rgba(255,228,94,0.55)",
  }),
  // Mono's ramp follows the album's label colour.
  withMini({
    name: "Mono",
    bg: "#EEEEEE",
    ink: "#111111",
    sub: "#5A5A5A",
    dark: false,
    ramp: [0.08, 0.22, 0.4, 0.58, 0.78, 1].map((a) => `rgba(${hexRgb(c.label)},${a})`),
    blend: "multiply",
    hot: "rgba(255,255,255,0.25)",
  }),
  withMini({
    name: "Plasma",
    bg: "#160A28",
    ink: "#F6F1FF",
    sub: "#A99BC4",
    dark: true,
    ramp: ["#0D0887", "#6A00A8", "#B12A90", "#E16462", "#FCA636", "#F0F921"],
    blend: "color",
    hot: "rgba(240,249,33,0.45)",
  }),
];

/** 14×8 replay grid, warmer for higher scores, seeded by the handle so a reviewer's grid is stable. */
function cells(c: StoryContent, ramp: string[]) {
  let hs = 0;
  for (let k = 0; k < c.handle.length; k++) hs = (hs * 31 + c.handle.charCodeAt(k)) % 9973;
  const rnd = (i: number) => {
    const x = Math.sin(i * 12.9898 + hs * 0.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return Array.from({ length: 8 * 14 }, (_, i) => {
    const row = Math.floor(i / 14);
    const col = i % 14;
    const v = 0.15 + (c.score / 10) * 0.45 + (rnd(i) - 0.5) * 0.7 + (row === 1 || row === 5 ? 0.2 : 0) + (col > 9 ? 0.08 : 0);
    return ramp[Math.floor(Math.max(0, Math.min(0.999, v)) * 6)];
  });
}

const CELL = (360 - 56 - 13 * 2) / 14;

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  const { show } = c;
  return (
    <View style={{ position: "absolute", inset: 0, paddingTop: 30, paddingHorizontal: 28, paddingBottom: 80, gap: 14 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Eyebrow>Replay heat</Eyebrow>
        <Eyebrow>Last 14 days</Eyebrow>
      </View>
      {(show.art || show.rating) && (
        <View style={{ flexDirection: "row", gap: 16, alignItems: "flex-end" }}>
          {show.art && (
            <View style={{ width: 168, height: 168, borderRadius: 3, overflow: "hidden", isolation: "isolate" }}>
              <Art uri={c.art} filter="grayscale(1) contrast(1.4) blur(1.6px)" style={{ position: "absolute", inset: -6 }} />
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  experimental_backgroundImage: `linear-gradient(160deg, ${v.ramp.slice(1).join(", ")})`,
                  mixBlendMode: v.blend,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  experimental_backgroundImage: `radial-gradient(circle at 62% 40%, ${v.hot} 0%, transparent 45%)`,
                  mixBlendMode: "screen",
                }}
              />
            </View>
          )}
          {show.rating && (
            <View style={{ gap: 6 }}>
              <Eyebrow size={11}>Heat index</Eyebrow>
              <T style={font(F.serif, 84, 0.8, -0.03)}>{c.scoreText}</T>
            </View>
          )}
        </View>
      )}
      {show.artist && <ArtistTitle artist={c.artist} title={c.title} />}
      <View aria-hidden style={{ flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
        {cells(c, v.ramp).map((bg, k) => (
          <View key={k} style={{ width: CELL, height: 14, borderRadius: 2, backgroundColor: bg }} />
        ))}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <T sub style={font(F.sans, 11)}>
          cold
        </T>
        <View
          style={{ flex: 1, height: 8, borderRadius: 999, experimental_backgroundImage: `linear-gradient(90deg, ${v.ramp.join(", ")})` }}
        >
          {show.rating && (
            <View
              style={{
                position: "absolute",
                left: `${Math.round(c.score * 10)}%`,
                top: -4,
                width: 3,
                height: 16,
                marginLeft: -1,
                borderRadius: 2,
                backgroundColor: v.sub,
              }}
            />
          )}
        </View>
        <T sub style={font(F.sans, 11)}>
          hot
        </T>
      </View>
      {show.head && <T style={font(F.serifItalic, c.n <= 60 ? 34 : c.n <= 120 ? 28 : 22, 1.02)}>“{c.head}”</T>}
    </View>
  );
}

export const heatmap: StyleDef = { variants, Layout };
