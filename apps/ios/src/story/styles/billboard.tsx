import { View, type TextStyle, type ViewStyle } from "react-native";
import type { StoryContent } from "../../storyDraft";
import { ArtistTitle, CREAM, CREAM_SUB, Cover, Eyebrow, F, T, font } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & { align: ViewStyle["alignItems"]; ta: TextStyle["textAlign"]; poster: boolean; tilt: number; art: number };

const variants = (c: StoryContent): [V, V, V] => [
  {
    name: "Poster",
    bg: "#EEEEEE",
    ink: "#111111",
    sub: "#5A5A5A",
    dark: false,
    align: "flex-start",
    ta: "left",
    poster: true,
    tilt: 0,
    art: 96,
  },
  {
    name: "Marquee",
    bg: "#141414",
    ink: "#EEEEEE",
    sub: "#A6A6A6",
    dark: true,
    align: "center",
    ta: "center",
    poster: false,
    tilt: 0,
    art: c.n > 100 ? 110 : 150,
  },
  { name: "Label", bg: c.label, ink: CREAM, sub: CREAM_SUB, dark: true, align: "flex-end", ta: "right", poster: false, tilt: 4, art: 120 },
];

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  const { show } = c;
  const headSize = c.n <= 50 ? 66 : c.n <= 100 ? 50 : c.n <= 160 ? 36 : 30;
  const artistTitle = <ArtistTitle artist={c.artist} title={c.title} align={v.ta} />;
  return (
    <View
      style={{ position: "absolute", inset: 0, paddingTop: 30, paddingHorizontal: 30, paddingBottom: 80, gap: 16, alignItems: v.align }}
    >
      <View
        style={{ alignSelf: "stretch", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", minHeight: 22 }}
      >
        <Eyebrow>{c.head ? "Short take" : "Album"}</Eyebrow>
        {show.rating && <T style={font(F.serif, 52, 0.8, -0.02)}>{c.scoreText}</T>}
      </View>
      {!v.poster && show.art && <Cover uri={c.art} size={v.art} tilt={v.tilt} shadow="0 22px 36px -18px rgba(0,0,0,0.6)" />}
      {show.head ? (
        <View style={{ flex: 1, minHeight: 0, alignSelf: "stretch", justifyContent: "center" }}>
          <T numberOfLines={10} style={[font(F.serif, headSize, 0.98, -0.02), { textAlign: v.ta }]}>
            {c.head}
          </T>
        </View>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      {v.poster && (show.art || show.artist) && (
        <View style={{ alignSelf: "stretch", flexDirection: "row", alignItems: "center", gap: 14 }}>
          {show.art && <Cover uri={c.art} size={96} ring="rgba(17,17,17,0.2)" shadow="0 14px 24px -14px rgba(0,0,0,0.6)" />}
          {show.artist && artistTitle}
        </View>
      )}
      {!v.poster && show.artist && artistTitle}
    </View>
  );
}

function Mini({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  return (
    <View style={{ position: "absolute", top: 6, bottom: 6, left: 10, right: 10, justifyContent: "center", alignItems: v.align }}>
      <T style={[font(F.serif, 18, 0.9), { textAlign: v.ta }]}>{"Short &\nsweet."}</T>
    </View>
  );
}

export const billboard: StyleDef = { variants, Layout, Mini };
