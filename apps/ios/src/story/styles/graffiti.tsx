import { View, type TextStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { StoryContent } from "../../storyDraft";
import { Duotone, F, font, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & { gInk: string; accent: string; spray?: TextStyle; light: string; gDark: string };

const mini = (ink: string) => ({ glyph: "9/10", font: F.marker, size: 20, ink });
/** RN text takes one shadow, so the design's spray keeps its inner glow. */
const glow = (color: string, radius: number): TextStyle => ({
  textShadowColor: color,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: radius,
});
// RN gradients don't repeat, so the design's repeating stripes are one stripe per background tile.
const variants = (): [V, V, V] => [
  {
    name: "Tile",
    bg: "#EDEDE6",
    ink: "#141414",
    sub: "#4A4A4A",
    dark: false,
    img: "linear-gradient(0deg, rgba(0,0,0,0.13) 0px 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.13) 0px 2px, transparent 2px)",
    size: "64px 64px",
    gInk: "#141414",
    accent: "#C0392B",
    light: "#FAFAF7",
    gDark: "#141414",
    mini: mini("#141414"),
  },
  {
    // The design tilts these lines 10°; a vertical stripe per 9px tile is the closest repeat.
    name: "Stall",
    bg: "#6F8A78",
    ink: "#F3F1EA",
    sub: "rgba(243,241,234,0.8)",
    dark: true,
    img: "linear-gradient(90deg, rgba(255,255,255,0.05) 0px 1px, transparent 1px)",
    size: "9px 9px",
    gInk: "#F3F1EA",
    accent: "#F2C14E",
    spray: glow("rgba(0,0,0,0.4)", 1),
    light: "#F4F1EA",
    gDark: "#2E3B33",
    mini: mini("#F3F1EA"),
  },
  {
    name: "Spray",
    bg: "#4E4D4A",
    ink: "#F3F1EA",
    sub: "rgba(243,241,234,0.75)",
    dark: true,
    img: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1.5px), radial-gradient(rgba(0,0,0,0.18) 1px, transparent 1.5px)",
    size: "5px 5px, 7px 7px",
    gInk: "#FF4FA3",
    accent: "#FFE14D",
    spray: glow("rgba(255,79,163,0.7)", 6),
    light: "#FFE14D",
    gDark: "#2A1A3A",
    mini: mini("#FF4FA3"),
  },
];

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants()[i];
  const { show } = c;
  const marker = (size: number, lh: number, color = v.gInk) => [font(F.marker, size, lh), { color }, v.spray];
  return (
    <View style={{ position: "absolute", inset: 0 }}>
      {show.rating && (
        <View
          style={{
            position: "absolute",
            left: 20,
            top: 54,
            transform: [{ rotate: "-8deg" }],
            paddingVertical: 16,
            paddingHorizontal: 22,
            borderWidth: 3,
            borderColor: v.accent,
            borderRadius: "50%",
          }}
        >
          <T style={marker(48, 1)}>
            {c.scoreText}
            <T style={marker(22, 1)}>/10</T>
          </T>
        </View>
      )}
      {show.art && show.rating && (
        <Svg width={80} height={60} viewBox="0 0 80 60" style={{ position: "absolute", left: 112, top: 150 }}>
          <Path d="M4 50 C 24 54, 52 44, 70 14" stroke={v.accent} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M58 16 L71 12 L73 26" stroke={v.accent} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      )}
      {show.art && (
        <View
          style={{
            position: "absolute",
            left: 186,
            top: 40,
            width: 152,
            height: 152,
            padding: 7,
            backgroundColor: "#FAFAF7",
            transform: [{ rotate: "7deg" }],
            boxShadow: "0 8px 14px -6px rgba(0,0,0,0.45)",
          }}
        >
          <Duotone uri={c.art} light={v.light} dark={v.gDark} filter="grayscale(1) contrast(1.9)" style={{ flex: 1 }} />
          <View
            style={{
              position: "absolute",
              right: -1,
              bottom: -1,
              width: 28,
              height: 28,
              experimental_backgroundImage: `linear-gradient(315deg, ${v.bg} 50%, #DCDCD4 50%)`,
              boxShadow: "-2px -2px 3px rgba(0,0,0,0.15)",
            }}
          />
        </View>
      )}
      {show.head && (
        <T
          style={[
            marker(c.n <= 60 ? 42 : c.n <= 120 ? 32 : 25, 1.12),
            { position: "absolute", left: 24, right: 24, top: show.art || show.rating ? 226 : 110, transform: [{ rotate: "-3deg" }] },
          ]}
        >
          {c.head}
        </T>
      )}
      {show.artist && (
        // RN can't thicken an underline, so the design's 3px marker rule is a plain underline.
        <T style={[marker(20, 1.3, v.accent), { position: "absolute", left: 30, right: 30, bottom: 96, transform: [{ rotate: "2deg" }] }]}>
          <T style={{ textDecorationLine: "underline" }}>{c.title}</T> by {c.artist}
        </T>
      )}
    </View>
  );
}

export const graffiti: StyleDef = { variants, Layout };
