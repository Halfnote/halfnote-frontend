import { View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import type { StoryContent } from "../../storyDraft";
import { CREAM, CREAM_SUB, Dash, DARK_DOTS, Dots, Duotone, F, font, Ink, T, Tile } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & { paper: string; pInk: string; pDim: string; tilt: number };

const mini = (ink: string, paper: string) => ({
  glyph: "9.1",
  font: F.mono,
  size: 11,
  ink,
  sh: [40, 50, 1, paper] as [number, number, number, string],
});
const variants = (c: StoryContent): [V, V, V] => [
  {
    name: "Thermal",
    bg: "#2B2B2B",
    ink: "#EEEEEE",
    sub: "#A6A6A6",
    dark: true,
    paper: "#FBFBF8",
    pInk: "#222222",
    pDim: "#6A6A6A",
    tilt: -1.5,
    mini: mini("#222222", "#FBFBF8"),
  },
  {
    name: "Faded",
    bg: c.label,
    ink: CREAM,
    sub: CREAM_SUB,
    dark: true,
    paper: "#F3EBD3",
    pInk: "#5E5648",
    pDim: "#857C6B",
    tilt: 1.2,
    mini: mini("#5E5648", "#F3EBD3"),
  },
  {
    name: "Carbon",
    bg: "#D6D6D2",
    img: DARK_DOTS,
    ink: "#111111",
    sub: "#4A4A4A",
    dark: false,
    paper: "#F6C9D2",
    pInk: "#2B3A8C",
    pDim: "#56609C",
    tilt: -0.6,
    mini: mini("#2B3A8C", "#F6C9D2"),
  },
];

const W = 272;
/** Torn edge, 10px teeth; `down` points them at the bottom edge. */
function Teeth({ color, down }: { color: string; down?: boolean }) {
  let d = down ? "M0 0" : "M0 10";
  for (let x = 0; x < W; x += 10) d += down ? ` L${x} 7 L${x + 5} 2 L${x + 10} 7` : ` L${x} 3 L${x + 5} 8 L${x + 10} 3`;
  d += down ? ` L${W} 0 Z` : ` L${W} 10 Z`;
  return (
    <Svg width={W} height={10}>
      <Path d={d} fill={color} />
    </Svg>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
const stamp = (d: Date) =>
  `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${pad(d.getFullYear() % 100)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants(c)[i];
  const { show } = c;
  const long = c.mode === "long";
  const text = font(F.mono, 12, 1.5);
  const row = { flexDirection: "row", justifyContent: "space-between" } as const;
  return (
    <View style={{ position: "absolute", inset: 0, paddingTop: 20, paddingBottom: 80, alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: W, transform: [{ rotate: `${v.tilt}deg` }], filter: "drop-shadow(0px 18px 20px rgba(0,0,0,0.35))" }}>
        <Teeth color={v.paper} />
        <Ink value={{ ink: v.pInk, sub: v.pDim }}>
          <View style={{ backgroundColor: v.paper, paddingTop: 12, paddingHorizontal: 20, paddingBottom: 16, gap: long ? 7 : 10 }}>
            <View style={{ alignItems: "center" }}>
              <T style={font(F.mono600, 15, 1.5, 0.12)}>HALFNOTE RECORDS</T>
              <T sub style={font(F.mono, 11, 1.5)}>
                {stamp(new Date())} · CASHIER @{c.handle}
              </T>
            </View>
            <Dash color={v.pInk} opacity={0.5} />
            {show.art && (
              <Duotone
                uri={c.art}
                light={v.paper}
                dark={v.pInk}
                filter="grayscale(1) contrast(1.7) brightness(1.08)"
                style={{ alignSelf: "center", width: long ? 70 : 120, height: long ? 70 : 120 }}
              >
                <Dots color={v.paper} r1={0.8} r2={1.2} size={3} />
              </Duotone>
            )}
            {show.artist && (
              <View>
                <View style={row}>
                  <T style={text}>1 × LP</T>
                  <T style={text}>1</T>
                </View>
                <T style={[text, { textTransform: "uppercase" }]}>{c.title}</T>
                <T sub style={text}>
                  {c.artist}
                </T>
              </View>
            )}
            {show.rating && (
              <View>
                <View style={row}>
                  <T style={font(F.mono600, 14, 1.5)}>RATING</T>
                  <T style={font(F.mono600, 14, 1.5)}>{c.scoreText}/10</T>
                </View>
                {!long && <T style={[text, { letterSpacing: 12 * 0.3 }]}>{"*".repeat(Math.floor(c.score))}</T>}
              </View>
            )}
            {show.head && (
              <View style={{ gap: 2 }}>
                <T sub style={font(F.mono, 11, 1.5)}>
                  NOTE
                </T>
                <T style={font(F.mono, 13, 1.45)}>{c.head}</T>
              </View>
            )}
            {show.body && (
              <View style={{ gap: 6 }}>
                {c.paras.map((p, k) => (
                  <T key={k} style={font(F.mono, 10.5, 1.45)}>
                    {p}
                  </T>
                ))}
              </View>
            )}
            <Dash color={v.pInk} opacity={0.5} />
            <View style={{ height: long ? 26 : 36 }}>
              <Tile w={14} h={36}>
                {[
                  [0, 2],
                  [3, 1],
                  [6, 3],
                  [10, 1],
                ].map(([x, w]) => (
                  <Rect key={x} x={x} y={0} width={w} height={36} fill={v.pInk} />
                ))}
              </Tile>
            </View>
            <T style={[font(F.mono, 11, 1.5), { textAlign: "center" }]}>THANK YOU FOR LISTENING</T>
          </View>
        </Ink>
        <Teeth color={v.paper} down />
      </View>
    </View>
  );
}

export const receipt: StyleDef = { variants, Layout };
