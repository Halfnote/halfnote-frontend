import { View, type FlexStyle, type TextStyle } from "react-native";
import type { StoryContent } from "../../storyDraft";
import { ArtistTitle, bySize, Cover, CREAM, CREAM_SUB, Eyebrow, F, font, levels, T, Vinyl } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & { ta: TextStyle["textAlign"]; jc: FlexStyle["justifyContent"] };

const variants = (c: StoryContent): [V, V, V] => [
  { name: "Giant", bg: "#EEEEEE", ink: "#111111", sub: "#5A5A5A", dark: false, ta: "left", jc: "flex-start" },
  { name: "Record", bg: "#141414", ink: "#EEEEEE", sub: "#A6A6A6", dark: true, ta: "center", jc: "center" },
  { name: "Meter", bg: c.label, ink: CREAM, sub: CREAM_SUB, dark: true, ta: "left", jc: "flex-start" },
];

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  const { show } = c;
  const giant = show.rating && i === 0;
  const record = show.rating && i === 1;
  const meter = show.rating && i === 2;
  const rowArt = show.art && (giant || meter);
  return (
    <View style={{ position: "absolute", inset: 0, paddingTop: 30, paddingHorizontal: 28, paddingBottom: 80, gap: 16 }}>
      {giant && (
        <View style={{ gap: 8 }}>
          <Eyebrow>Rated</Eyebrow>
          <T style={[font(F.serif, 196, 0.78, -0.045), { marginLeft: -6 }]}>{c.scoreText}</T>
        </View>
      )}
      {record && (
        <View style={{ height: 300 }}>
          <View style={{ position: "absolute", left: 7, top: 0 }}>
            <Vinyl
              size={290}
              groove="#1a1a1a"
              land="#303030"
              sheen={0.12}
              label={c.label}
              labelSize={126}
              shadow="0 0 0 1px rgba(238,238,238,0.12), 0 24px 40px -20px rgba(0,0,0,0.8)"
            >
              <T style={[font(F.serif, 58, undefined, -0.02), { color: CREAM }]}>{c.scoreText}</T>
            </Vinyl>
          </View>
          {show.art && (
            <Cover
              uri={c.art}
              size={120}
              tilt={-7}
              ring="rgba(17,17,17,0.2)"
              shadow="0 18px 30px -14px rgba(0,0,0,0.8)"
              style={{ position: "absolute", left: -8, top: 182 }}
            />
          )}
        </View>
      )}
      {meter && (
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <T style={font(F.serif, 132, 0.78, -0.04)}>{c.scoreText}</T>
          <View aria-hidden style={{ flexDirection: "row", alignItems: "flex-end", gap: 5, height: 112 }}>
            {levels(c.score, 0.22).map((op, k) => (
              <View key={k} style={{ width: 9, height: 22 + k * 10, borderRadius: 2, backgroundColor: v.ink, opacity: op }} />
            ))}
          </View>
        </View>
      )}
      {!show.rating && show.art && (
        <Cover uri={c.art} size={250} shadow="0 24px 38px -18px rgba(0,0,0,0.6)" style={{ alignSelf: i === 1 ? "center" : "flex-start" }} />
      )}
      {(rowArt || show.artist) && (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: v.jc, gap: 14 }}>
          {rowArt && <Cover uri={c.art} size={96} ring="rgba(17,17,17,0.2)" shadow="0 14px 24px -14px rgba(0,0,0,0.6)" />}
          {show.artist && <ArtistTitle artist={c.artist} title={c.title} align={v.ta} />}
        </View>
      )}
      {show.head && (
        <T numberOfLines={6} style={[font(F.serifItalic, bySize(c.n, 32, 28, 24), 1.02), { textAlign: v.ta }]}>
          “{c.head}”
        </T>
      )}
    </View>
  );
}

const Mini = ({ c }: { c: StoryContent }) => (
  <T style={[font(F.serif, 40, 1, -0.03), { position: "absolute", left: 10, bottom: 4 }]}>{c.scoreText}</T>
);

export const score: StyleDef = { variants, Layout, Mini };
