import { View, type TextStyle } from "react-native";
import type { StoryContent } from "../../storyDraft";
import { Art, ArtistTitle, bySize, CREAM, CREAM_SUB, DARK_DOTS, F, font, Ring, T, Vinyl } from "../kit";
import type { StyleDef, Variant } from "./types";

type XY = [x: number, y: number];
type V = Variant & {
  ta: TextStyle["textAlign"];
  stageH: number;
  /** Sleeve [x, y, size]. */
  s: [number, number, number];
  /** Vinyl [x, y, size], or none. */
  v: [number, number, number] | null;
  /** Rating sticker position. */
  st: XY;
  stBg: string;
  stFg: string;
  accent: string;
  /** Swatch sleeve and record, [x, y, size]. */
  m: { s: [number, number, number]; c: [number, number, number] | null };
};

const variants = (c: StoryContent): [V, V, V] => [
  {
    name: "Pulled",
    bg: "#D6D6D2",
    img: DARK_DOTS,
    ink: "#111111",
    sub: "#4A4A4A",
    dark: false,
    ta: "left",
    stageH: 320,
    s: [28, 30, 260],
    v: [148, 38, 244],
    st: [214, 222],
    stBg: "#111111",
    stFg: "#EEEEEE",
    accent: c.label,
    m: { s: [14, 14, 32], c: [32, 15, 30] },
  },
  {
    name: "Lifted",
    bg: "#141414",
    ink: "#EEEEEE",
    sub: "#A6A6A6",
    dark: true,
    ta: "center",
    stageH: 360,
    s: [55, 110, 250],
    v: [62, 12, 236],
    st: [28, 94],
    stBg: c.label,
    stFg: CREAM,
    accent: c.label,
    m: { s: [40, 26, 32], c: [41, 8, 30] },
  },
  {
    name: "Bleed",
    bg: c.label,
    ink: CREAM,
    sub: CREAM_SUB,
    dark: true,
    ta: "left",
    stageH: 330,
    s: [0, 0, 360],
    v: null,
    st: [252, 226],
    stBg: "#EEEEEE",
    stFg: "#111111",
    accent: "#EEEEEE",
    m: { s: [0, 0, 120], c: null },
  },
];

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const e = variants(c)[i];
  const { show } = c;
  // Without the sleeve the record moves into its place and the sticker centres on it.
  const v = show.art ? e.v : ([55, 35, 250] as const);
  const [stx, sty] = show.art || !v ? e.st : [v[0] + v[2] / 2 - 42, v[1] + v[2] / 2 - 42];
  const [sx, sy, ss] = e.s;
  return (
    <View style={{ position: "absolute", inset: 0, paddingBottom: 80 }}>
      <View style={{ height: e.stageH, overflow: "hidden" }}>
        {v && (
          <View style={{ position: "absolute", left: v[0], top: v[1] }}>
            <Vinyl
              size={v[2]}
              groove="#141414"
              land="#2b2b2b"
              sheen={0.14}
              label={c.label}
              labelSize={Math.round(v[2] * 0.34)}
              shadow="0 22px 34px -18px rgba(0,0,0,0.6)"
            >
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#D6D6D2" }} />
            </Vinyl>
          </View>
        )}
        {show.art && (
          <View
            style={{
              position: "absolute",
              left: sx,
              top: sy,
              width: ss,
              height: ss,
              borderRadius: 2,
              boxShadow: "0 24px 38px -18px rgba(0,0,0,0.6)",
            }}
          >
            <Art uri={c.art} style={{ flex: 1, borderRadius: 2 }}>
              <View style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 5, backgroundColor: "rgba(0,0,0,0.12)" }} />
              <Ring color="rgba(17,17,17,0.18)" />
            </Art>
          </View>
        )}
        {show.rating && (
          <View
            style={{
              position: "absolute",
              left: stx,
              top: sty,
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: e.stBg,
              transform: [{ rotate: "-10deg" }],
              boxShadow: "0 10px 20px -10px rgba(0,0,0,0.6)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <T style={[font(F.serif, 36, undefined, -0.02), { color: e.stFg }]}>{c.scoreText}</T>
          </View>
        )}
      </View>
      <View style={{ paddingTop: 22, paddingHorizontal: 28, gap: 12 }}>
        {show.artist && <ArtistTitle artist={c.artist} title={c.title} align={e.ta} />}
        {show.head && (
          <T numberOfLines={8} style={[font(F.serifItalic, bySize(c.n, 34, 28, 22), 1.02), { textAlign: e.ta }]}>
            “{c.head}”
          </T>
        )}
      </View>
    </View>
  );
}

function Mini({ c, i }: { c: StoryContent; i: number }) {
  const { m, accent } = variants(c)[i];
  return (
    <>
      {m.c && (
        <View
          style={{
            position: "absolute",
            left: m.c[0],
            top: m.c[1],
            width: m.c[2],
            height: m.c[2],
            borderRadius: m.c[2] / 2,
            backgroundColor: "#222",
          }}
        />
      )}
      <View
        style={{
          position: "absolute",
          left: m.s[0],
          top: m.s[1],
          width: m.s[2],
          height: m.s[2],
          borderRadius: 1,
          backgroundColor: accent,
          boxShadow: "0 4px 8px -4px rgba(0,0,0,0.5)",
        }}
      />
    </>
  );
}

export const sleeve: StyleDef = { variants, Layout, Mini };
