import { View } from "react-native";
import type { StoryContent } from "../../storyDraft";
import { Cover, CREAM, CREAM_SUB, Eyebrow, F, font, Ink, LIGHT_DOTS, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & { card: boolean };

const variants = (c: StoryContent): [V, V, V] => [
  { name: "Page", bg: "#F1EEE6", ink: "#1A1A1A", sub: "#5E5A52", dark: false, card: false },
  { name: "Ink", bg: "#141414", ink: "#EEEEEE", sub: "#A6A6A6", dark: true, card: false },
  { name: "Insert", bg: c.label, img: LIGHT_DOTS, ink: CREAM, sub: CREAM_SUB, dark: true, card: true },
];

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  const { show } = c;
  const { card } = v;
  const bodySize = card ? 18 : 20;
  const body = font(F.serif, bodySize, 1.28);
  return (
    <View style={{ position: "absolute", inset: 0, paddingTop: card ? 24 : 30, paddingHorizontal: card ? 22 : 28, paddingBottom: 80 }}>
      <Ink value={{ ink: card ? "#1A1A1A" : v.ink, sub: card ? "#5E5A52" : v.sub }}>
        <View
          style={{
            backgroundColor: card ? CREAM : "transparent",
            padding: card ? 22 : 0,
            borderRadius: card ? 4 : 0,
            boxShadow: card ? "0 26px 44px -20px rgba(0,0,0,0.55)" : undefined,
            gap: 14,
          }}
        >
          {(show.art || show.artist || show.rating) && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              {show.art && <Cover uri={c.art} size={64} ring="rgba(17,17,17,0.2)" shadow="0 10px 18px -10px rgba(0,0,0,0.5)" />}
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                {show.artist && (
                  <>
                    <Eyebrow size={11}>{c.artist}</Eyebrow>
                    <T style={font(F.serif, 21, 1)}>{c.title}</T>
                  </>
                )}
              </View>
              {show.rating && <T style={font(F.serif, 44, 0.8, -0.02)}>{c.scoreText}</T>}
            </View>
          )}
          {show.head && (
            <T
              numberOfLines={4}
              style={[
                font(F.serifItalic, c.n <= 60 ? 32 : 26, 1.02),
                { paddingBottom: 14, borderBottomWidth: 1, borderColor: card || !v.dark ? "rgba(17,17,17,0.2)" : "rgba(238,238,238,0.25)" },
              ]}
            >
              {c.head}
            </T>
          )}
          <View style={{ gap: 10 }}>
            {c.paras.map((p, k) =>
              k === 0 ? (
                // RN text can't float a drop cap, so the initial is a raised cap on the first line.
                <T key={k} style={body}>
                  <T style={font(F.serif, card ? 54 : 60, 0.8)}>{p.charAt(0)}</T>
                  {p.slice(1)}
                </T>
              ) : (
                // No text-indent in RN; an em space plus an en space stands in for the design's 1.4em.
                <T key={k} style={body}>
                  {"  " + p}
                </T>
              ),
            )}
          </View>
        </View>
      </Ink>
    </View>
  );
}

function Mini({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  const ink = v.card ? "#1A1A1A" : v.ink;
  const line = { height: 2, backgroundColor: ink, opacity: 0.6 };
  return (
    <View
      style={[
        {
          position: "absolute",
          padding: 7,
          borderRadius: 3,
          backgroundColor: v.card ? CREAM : "transparent",
          flexDirection: "row",
          gap: 5,
        },
        v.card ? { top: 9, bottom: 9, left: 12, right: 12 } : { top: 4, bottom: 4, left: 6, right: 6 },
      ]}
    >
      <T style={[font(F.serif, 24, 0.8), { color: ink }]}>O</T>
      <View style={{ flex: 1, gap: 4, paddingTop: 2 }}>
        <View style={line} />
        <View style={line} />
        <View style={[line, { width: "70%" }]} />
      </View>
    </View>
  );
}

export const liner: StyleDef = { variants, Layout, Mini };
