import { View } from "react-native";
import type { StoryContent } from "../../storyDraft";
import { ArtistTitle, bySize, Cover, CREAM, CREAM_SUB, DARK_DOTS, F, font, Ink, levels, LIGHT_DOTS, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & { win: string; winInk: string; winSub: string; stripe: string; rule: string; accent: string };

const variants = (c: StoryContent): [V, V, V] => [
  {
    name: "Classic",
    bg: "#D6D6D2",
    img: DARK_DOTS,
    ink: "#111111",
    sub: "#4A4A4A",
    dark: false,
    win: "#EEEEEE",
    winInk: "#111111",
    winSub: "#5A5A5A",
    stripe: "rgba(17,17,17,0.2)",
    rule: "rgba(17,17,17,0.25)",
    accent: c.label,
  },
  {
    name: "Inverse",
    bg: "#0F0F0F",
    img: LIGHT_DOTS,
    ink: "#EEEEEE",
    sub: "#A6A6A6",
    dark: true,
    win: "#1A1A1A",
    winInk: "#EEEEEE",
    winSub: "#A6A6A6",
    stripe: "rgba(238,238,238,0.22)",
    rule: "rgba(238,238,238,0.25)",
    accent: c.label,
  },
  {
    name: "Tinted",
    bg: c.label,
    img: LIGHT_DOTS,
    ink: CREAM,
    sub: CREAM_SUB,
    dark: true,
    win: "#EEEEEE",
    winInk: "#111111",
    winSub: "#5A5A5A",
    stripe: "rgba(17,17,17,0.2)",
    rule: "rgba(17,17,17,0.25)",
    accent: c.label,
  },
];

/** Classic Mac title-bar stripes; `repeating-linear-gradient` isn't in RN, so each line is a view. */
const Stripes = ({ color, every, inset }: { color: string; every: number[]; inset: number }) =>
  every.map((top) => (
    <View key={top} style={{ position: "absolute", left: inset, right: inset, top, height: 1, backgroundColor: color }} />
  ));

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  const { show } = c;
  const long = c.mode === "long";
  const box = {
    width: 13,
    height: 13,
    borderWidth: 1,
    borderColor: v.winInk,
    borderRadius: 2,
    backgroundColor: v.win,
    boxShadow: `0 0 0 3px ${v.win}`,
  };
  return (
    <View style={{ position: "absolute", inset: 0, paddingTop: 28, paddingHorizontal: 22, paddingBottom: 82, justifyContent: "center" }}>
      <View style={{ borderRadius: 6, boxShadow: "0 26px 44px -20px rgba(0,0,0,0.55)" }}>
        <View style={{ backgroundColor: v.win, borderWidth: 1.5, borderColor: v.winInk, borderRadius: 6, overflow: "hidden" }}>
          <Ink value={{ ink: v.winInk, sub: v.winSub }}>
            <View
              style={{
                height: 30,
                borderBottomWidth: 1,
                borderColor: v.rule,
                paddingHorizontal: 9,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Stripes color={v.stripe} every={[6, 15, 24]} inset={9} />
              <View style={box} />
              <View style={{ flex: 1, alignItems: "center" }}>
                <T style={[font(F.sans500, 13), { lineHeight: 30, backgroundColor: v.win, paddingHorizontal: 10 }]}>
                  @{c.handle}’s {long ? "review" : c.head ? "take" : "album"}
                </T>
              </View>
              <View style={box} />
            </View>
            <View style={{ padding: 18, gap: 12 }}>
              {(show.art || show.rating) && (
                <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 16 }}>
                  {show.art && <Cover uri={c.art} size={long ? 96 : 150} ring="rgba(17,17,17,0.2)" />}
                  {show.rating && (
                    <View style={{ gap: 8 }}>
                      <T style={font(F.serif, long ? 56 : show.art ? 72 : 110, 0.8, -0.02)}>{c.scoreText}</T>
                      <View style={{ flexDirection: "row", gap: 3 }}>
                        {levels(c.score, 0.2).map((op, k) => (
                          <View key={k} style={{ width: 8, height: 14, borderRadius: 1, backgroundColor: v.winInk, opacity: op }} />
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}
              {show.artist && <ArtistTitle artist={c.artist} title={c.title} size={24} />}
              {show.head && (
                <T numberOfLines={6} style={font(F.serifItalic, long ? 24 : bySize(c.n, 32, 26, 22), 1.02)}>
                  “{c.head}”
                </T>
              )}
              {show.body && (
                <View style={{ gap: 8 }}>
                  {c.paras.map((p, k) => (
                    <T key={k} style={font(F.sans, 14, 1.5)}>
                      {p}
                    </T>
                  ))}
                </View>
              )}
            </View>
          </Ink>
        </View>
      </View>
    </View>
  );
}

function Mini({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  return (
    <View
      style={{
        position: "absolute",
        top: 12,
        bottom: 12,
        left: 16,
        right: 16,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: v.winInk,
        backgroundColor: v.win,
        overflow: "hidden",
      }}
    >
      <View style={{ height: 9, borderBottomWidth: 1, borderColor: v.winInk, opacity: 0.6 }}>
        <Stripes color={v.winInk} every={[2, 5]} inset={0} />
      </View>
      <View style={{ position: "absolute", left: 7, top: 15, width: 14, height: 14, backgroundColor: v.accent }} />
    </View>
  );
}

export const system: StyleDef = { variants, Layout, Mini };
