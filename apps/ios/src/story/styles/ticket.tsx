import { View } from "react-native";
import { Rect } from "react-native-svg";
import type { StoryContent } from "../../storyDraft";
import { Art, CREAM, CREAM_SUB, DARK_DOTS, Dash, Duotone, F, font, Ink, T, Tile } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & {
  paper: string;
  paperImg?: string;
  tInk: string;
  accent: string;
  artFilter: string;
  duo: boolean;
  light: string;
  dark2: string;
  foil?: string;
  tilt: number;
};

const mini = (ink: string, bg: string) => ({
  glyph: "ADMIT",
  font: F.alfa,
  size: 10,
  ink,
  sh: [60, 32, 4, bg] as [number, number, number, string],
});
const variants = (c: StoryContent): [V, V, V] => [
  {
    name: "Stub",
    bg: c.label,
    ink: CREAM,
    sub: CREAM_SUB,
    dark: true,
    paper: "#F4E3C3",
    tInk: "#3A2412",
    accent: "#C8312B",
    artFilter: "grayscale(1) contrast(1.5)",
    duo: true,
    light: "#F4E3C3",
    dark2: "#3A2412",
    tilt: -2,
    mini: mini("#C8312B", "#F4E3C3"),
  },
  {
    name: "Holo",
    bg: "#121212",
    ink: "#EEEEEE",
    sub: "#A6A6A6",
    dark: true,
    paper: "#ECE6F7",
    paperImg: "linear-gradient(135deg, #ECE6F7, #CFEAF3 30%, #F6D9E8 62%, #E6F4D6)",
    tInk: "#1A1A2E",
    accent: "#6A3FD1",
    artFilter: "saturate(1.2)",
    duo: false,
    light: "#FFFFFF",
    dark2: "#000000",
    foil: "linear-gradient(115deg, rgba(255,0,170,0.28), rgba(0,200,255,0.28) 45%, rgba(255,230,0,0.28))",
    tilt: 1.5,
    mini: mini("#6A3FD1", "linear-gradient(135deg, #ECE6F7, #CFEAF3, #F6D9E8)"),
  },
  {
    name: "Will Call",
    bg: "#D6D6D2",
    img: DARK_DOTS,
    ink: "#111111",
    sub: "#4A4A4A",
    dark: false,
    paper: "#FFFFFF",
    tInk: "#111111",
    accent: "#111111",
    artFilter: "grayscale(1) contrast(1.8)",
    duo: true,
    light: "#FFFFFF",
    dark2: "#111111",
    tilt: -0.5,
    mini: mini("#111111", "#FFFFFF"),
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  const { show } = c;
  const artH = c.n > 100 ? 140 : 180;
  const paper = { backgroundColor: v.paper, experimental_backgroundImage: v.paperImg };
  const now = new Date();
  const cells = [
    ["DATE", `${pad(now.getMonth() + 1)}.${pad(now.getDate())}.${pad(now.getFullYear() % 100)}`],
    ["DOORS", "8:00 PM"],
    show.rating ? ["RATED", c.scoreText] : ["ROW", "GA"],
  ];
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        paddingTop: 26,
        paddingHorizontal: 50,
        paddingBottom: 80,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ink value={{ ink: v.tInk, sub: v.tInk }}>
        <View style={{ width: 260, transform: [{ rotate: `${v.tilt}deg` }], filter: "drop-shadow(0px 20px 24px rgba(0,0,0,0.4))" }}>
          <View style={[paper, { borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: "hidden" }]}>
            {show.art && (
              <View style={{ height: artH, isolation: "isolate" }}>
                {v.duo ? (
                  <Duotone uri={c.art} light={v.light} dark={v.dark2} filter={v.artFilter} style={{ flex: 1 }} />
                ) : (
                  <Art uri={c.art} filter={v.artFilter} style={{ flex: 1 }} />
                )}
                {v.foil && (
                  <View style={{ position: "absolute", inset: 0, experimental_backgroundImage: v.foil, mixBlendMode: "overlay" }} />
                )}
              </View>
            )}
            <View style={{ paddingTop: 14, paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <T style={font(F.sans600, 10, undefined, 0.14)}>HALFNOTE PRESENTS</T>
                <T style={[font(F.sans600, 10, undefined, 0.14), { color: v.accent }]}>NO. 0091</T>
              </View>
              {show.artist && (
                <View style={{ gap: 3 }}>
                  <T style={[font(F.alfa, 22, 1), { textTransform: "uppercase" }]}>{c.artist}</T>
                  <T style={font(F.serifItalic, 20, 1)}>{c.title}</T>
                </View>
              )}
              {show.head && <T style={font(F.serif, c.n <= 60 ? 26 : c.n <= 120 ? 22 : 18, 1.08)}>“{c.head}”</T>}
              <Dash color="rgba(0,0,0,0.25)" width={1} />
              <View style={{ flexDirection: "row", gap: 6 }}>
                {cells.map(([k, val]) => (
                  <View key={k} style={{ flex: 1, gap: 1 }}>
                    <T style={[font(F.sans600, 8, undefined, 0.12), { opacity: 0.65 }]}>{k}</T>
                    <T style={font(F.sans600, 14)}>{val}</T>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={[paper, { height: 18 }]}>
            <View style={{ position: "absolute", left: 14, right: 14, top: 8 }}>
              <Dash color={v.tInk} width={2} opacity={0.35} />
            </View>
            <View style={{ position: "absolute", left: -9, top: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: v.bg }} />
            <View style={{ position: "absolute", right: -9, top: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: v.bg }} />
          </View>
          <View
            style={[
              paper,
              {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                paddingTop: 10,
                paddingHorizontal: 16,
                paddingBottom: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
            ]}
          >
            <T style={[font(F.alfa, 18), { color: v.accent }]}>ADMIT ONE</T>
            <View style={{ width: 96, height: 32 }}>
              <Tile w={14} h={32}>
                {[
                  [0, 2],
                  [3, 1],
                  [6, 3],
                  [10, 1],
                ].map(([x, w]) => (
                  <Rect key={x} x={x} y={0} width={w} height={32} fill={v.tInk} />
                ))}
              </Tile>
            </View>
          </View>
        </View>
      </Ink>
    </View>
  );
}

export const ticket: StyleDef = { variants, Layout };
