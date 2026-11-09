import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { StoryContent } from "../../storyDraft";
import { Duotone, F, font, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & {
  tInk: string;
  ribbon: string;
  ribDark: string;
  ribInk: string;
  accent: string;
  light: string;
  medBg: string;
  glow: number;
  filter?: string;
  flash: boolean;
};

const mini = (ink: string) => ({ glyph: "9.1", font: F.pirata, size: 30, ink });
const SKIN = (shade: string, tint: string, crease: string) =>
  `radial-gradient(ellipse at 50% 30%, ${tint}, transparent 60%), linear-gradient(90deg, ${shade}, transparent 28%, transparent 47%, ${crease} 50%, transparent 53%, transparent 72%, ${shade})`;
const variants = (): [V, V, V] => [
  {
    name: "Flash",
    bg: "#EFE3C8",
    ink: "#1A1A1A",
    sub: "#5E5440",
    dark: false,
    tInk: "#1A1A1A",
    ribbon: "#C8312B",
    ribDark: "#8E1F1A",
    ribInk: "#F6EAD0",
    accent: "#E8B33A",
    light: "#E8B33A",
    medBg: "#F6EAD0",
    glow: 0,
    flash: true,
    mini: mini("#C8312B"),
  },
  {
    name: "Fresh",
    bg: "#94603F",
    img: SKIN("rgba(0,0,0,0.2)", "rgba(255,220,190,0.22)", "rgba(0,0,0,0.12)"),
    size: "auto",
    ink: "#F6EAD0",
    sub: "rgba(246,234,208,0.8)",
    dark: true,
    tInk: "#121212",
    ribbon: "#B8322A",
    ribDark: "#7E1E18",
    ribInk: "#F6EAD0",
    accent: "#D9A33A",
    light: "#D85A4A",
    medBg: "#B07050",
    glow: 0.35,
    flash: false,
    mini: mini("#121212"),
  },
  {
    name: "Healed",
    bg: "#E6C2A3",
    img: SKIN("rgba(120,70,40,0.16)", "rgba(255,240,225,0.35)", "rgba(120,70,40,0.1)"),
    size: "auto",
    ink: "#2C2620",
    sub: "#5E5040",
    dark: false,
    tInk: "#2C3E50",
    ribbon: "#5D7F8C",
    ribDark: "#3F5E6B",
    ribInk: "#F3E6D8",
    accent: "#7FA39A",
    light: "#E6C2A3",
    medBg: "#E6C2A3",
    glow: 0,
    filter: "blur(0.4px) saturate(0.8)",
    flash: false,
    mini: mini("#2C3E50"),
  },
];

const WING =
  "M140 60 C 110 40, 80 20, 20 30 C 60 38, 85 50, 100 62 C 70 58, 40 70, 10 95 C 50 82, 85 78, 112 80 C 95 90, 80 105, 70 118 C 100 100, 125 85, 140 75 Z";
const Wing = ({ v, flip }: { v: V; flip?: boolean }) => (
  <View style={{ position: "absolute", top: 34, [flip ? "right" : "left"]: 0, transform: flip ? [{ scaleX: -1 }] : [] }}>
    <Svg width={132} height={114} viewBox="0 0 140 120">
      <Path d={WING} fill={v.tInk} />
      <Path d="M120 52 C 100 44, 80 40, 58 42" stroke={v.accent} strokeWidth={3} fill="none" strokeLinecap="round" />
    </Svg>
  </View>
);

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants()[i];
  const { show } = c;
  const pirata = (size: number) => [font(F.pirata, size), { color: v.tInk }];
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 80,
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
      }}
    >
      {v.flash && (
        <View style={{ position: "absolute", left: 22, right: 22, top: 26, flexDirection: "row", justifyContent: "space-between" }}>
          <T style={pirata(22)}>Flash No. 23</T>
          <T style={pirata(22)}>$80</T>
        </View>
      )}
      <View style={{ width: 320, height: 200, filter: v.filter }}>
        {v.glow > 0 && (
          <View
            style={{
              position: "absolute",
              top: -30,
              bottom: -30,
              left: -10,
              right: -10,
              experimental_backgroundImage: `radial-gradient(ellipse at center, rgba(214,58,58,${v.glow}) 0%, transparent 62%)`,
            }}
          />
        )}
        <Wing v={v} />
        <Wing v={v} flip />
        <View
          style={{
            position: "absolute",
            left: 105,
            top: 18,
            width: 110,
            height: 110,
            borderRadius: 55,
            borderWidth: 6,
            borderColor: v.tInk,
            backgroundColor: v.medBg,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {show.art && (
            <Duotone
              uri={c.art}
              light={v.light}
              dark={v.tInk}
              filter="grayscale(1) contrast(1.8)"
              style={{ position: "absolute", inset: 0 }}
            />
          )}
          {!show.art && show.rating && <T style={pirata(46)}>{c.scoreText}</T>}
        </View>
        {show.art && show.rating && (
          <View
            style={{
              position: "absolute",
              left: 134,
              top: -16,
              width: 52,
              height: 52,
              transform: [{ rotate: "45deg" }],
              backgroundColor: v.accent,
              borderWidth: 4,
              borderColor: v.tInk,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <T style={[pirata(20), { transform: [{ rotate: "-45deg" }] }]}>{c.scoreText}</T>
          </View>
        )}
        <View style={{ position: "absolute", left: 40, top: 120, width: 240, height: 64 }}>
          <Svg width={240} height={64} viewBox="0 0 240 64" style={{ position: "absolute" }}>
            <Path d="M4 18 L44 18 L44 54 L4 54 L18 36 Z" fill={v.ribDark} stroke={v.tInk} strokeWidth={3.5} strokeLinejoin="round" />
            <Path d="M236 18 L196 18 L196 54 L236 54 L222 36 Z" fill={v.ribDark} stroke={v.tInk} strokeWidth={3.5} strokeLinejoin="round" />
            <Path
              d="M30 8 Q120 -2 210 8 L210 46 Q120 36 30 46 Z"
              fill={v.ribbon}
              stroke={v.tInk}
              strokeWidth={3.5}
              strokeLinejoin="round"
            />
          </Svg>
          <View style={{ position: "absolute", left: 34, right: 34, top: 6, height: 34, alignItems: "center", justifyContent: "center" }}>
            <T numberOfLines={1} style={[font(F.pirata, show.artist && c.artist.length > 16 ? 17 : 22), { color: v.ribInk }]}>
              {show.artist ? c.artist : "Forever"}
            </T>
          </View>
        </View>
      </View>
      {show.head && (
        <View style={{ maxWidth: 304, filter: v.filter }}>
          <T style={[font(F.yellowtail, c.n <= 60 ? 40 : c.n <= 120 ? 32 : 26, 1.1), { textAlign: "center", color: v.tInk }]}>{c.head}</T>
        </View>
      )}
    </View>
  );
}

export const tattoo: StyleDef = { variants, Layout };
