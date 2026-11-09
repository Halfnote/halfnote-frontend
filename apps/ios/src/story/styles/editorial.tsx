import { View, type FlexStyle, type TextStyle, type ViewStyle } from "react-native";
import type { StoryContent } from "../../storyDraft";
import { ArtistTitle, bySize, Cover, CREAM, CREAM_SUB, Eyebrow, F, font, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & {
  align: ViewStyle["alignItems"];
  ta: TextStyle["textAlign"];
  jc: FlexStyle["justifyContent"];
  dir: FlexStyle["flexDirection"];
  tilt: number;
  accent: string;
};

const variants = (c: StoryContent): [V, V, V] => [
  {
    name: "Paper",
    bg: "#EEEEEE",
    ink: "#111111",
    sub: "#5A5A5A",
    dark: false,
    align: "flex-start",
    ta: "left",
    jc: "flex-start",
    dir: "row",
    tilt: 0,
    accent: c.label,
  },
  {
    name: "Night",
    bg: "#141414",
    ink: "#EEEEEE",
    sub: "#A6A6A6",
    dark: true,
    align: "center",
    ta: "center",
    jc: "center",
    dir: "column",
    tilt: 0,
    accent: c.label,
  },
  {
    name: "Label",
    bg: c.label,
    ink: CREAM,
    sub: CREAM_SUB,
    dark: true,
    align: "flex-end",
    ta: "right",
    jc: "flex-start",
    dir: "row-reverse",
    tilt: 3,
    accent: "#EEEEEE",
  },
];

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  const { show } = c;
  return (
    <View style={{ position: "absolute", inset: 0, paddingTop: 30, paddingHorizontal: 30, paddingBottom: 80, gap: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", minHeight: 22 }}>
        <Eyebrow>Review</Eyebrow>
        {show.rating && <T style={font(F.serif, 56, 0.8, -0.02)}>{c.scoreText}</T>}
      </View>
      {(show.art || show.artist) && (
        <View style={{ flexDirection: v.dir, alignItems: "center", justifyContent: v.jc, gap: 14 }}>
          {show.art && <Cover uri={c.art} size={112} tilt={v.tilt} shadow="0 16px 26px -14px rgba(0,0,0,0.55)" />}
          {show.artist && <ArtistTitle artist={c.artist} title={c.title} align={v.ta} />}
        </View>
      )}
      {show.head && (
        <T numberOfLines={5} style={[font(F.serifItalic, bySize(c.n, 38, 30, 24), 1, -0.01), { textAlign: v.ta }]}>
          “{c.head}”
        </T>
      )}
      <View style={{ gap: 10 }}>
        {c.paras.map((p, k) => (
          <T key={k} style={[font(F.sans, 15, 1.5), { opacity: 0.9, textAlign: v.ta }]}>
            {p}
          </T>
        ))}
      </View>
    </View>
  );
}

function Mini({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  const line = (width: number, height: number, opacity = 1) => ({ width, height, borderRadius: 2, backgroundColor: v.ink, opacity });
  return (
    <View style={{ position: "absolute", top: 10, bottom: 10, left: 12, right: 12, alignItems: v.align, gap: 4 }}>
      <View style={{ width: 18, height: 18, borderRadius: 1, backgroundColor: v.accent, transform: [{ rotate: `${v.tilt}deg` }] }} />
      <View style={line(50, 3)} />
      <View style={line(50, 2, 0.45)} />
      <View style={line(36, 2, 0.45)} />
    </View>
  );
}

export const editorial: StyleDef = { variants, Layout, Mini };
