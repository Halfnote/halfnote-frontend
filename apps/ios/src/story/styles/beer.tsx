import { View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import type { StoryContent } from "../../storyDraft";
import { Art, Duotone, Eyebrow, F, font, Ink, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & {
  label: string;
  labelImg?: string;
  bInk: string;
  hdr: string;
  artFilter?: string;
  duo: boolean;
  /** iOS has no sepia filter; Retro's sepia(0.7) is a warm multiply wash over the cover. */
  sepia?: boolean;
  bLight: string;
  bDark: string;
  drops: number;
};

const sh = (bg: string) => ({ sh: [30, 46, 5, bg] as [number, number, number, string] });
const variants = (): [V, V, V] => [
  {
    name: "Tallboy",
    bg: "#CFE0E4",
    ink: "#1E2B3A",
    sub: "#4A5A68",
    dark: false,
    label: "#F3EDE0",
    bInk: "#1E2B3A",
    hdr: "#1E2B3A",
    duo: false,
    bLight: "#FFFFFF",
    bDark: "#000000",
    drops: 0.55,
    mini: sh("#F3EDE0"),
  },
  {
    name: "Craft",
    bg: "#151515",
    ink: "#EEEEEE",
    sub: "#A6A6A6",
    dark: true,
    label: "#1E1E1E",
    bInk: "#F2F2F2",
    hdr: "#F2F2F2",
    artFilter: "grayscale(1) contrast(1.6)",
    duo: true,
    bLight: "#D9C9A8",
    bDark: "#1E1E1E",
    drops: 0.25,
    mini: sh("#2A2A2A"),
  },
  {
    name: "Retro",
    bg: "#E7D7B1",
    ink: "#3A2410",
    sub: "#6E5434",
    dark: false,
    label: "#F3E3B5",
    labelImg: "linear-gradient(#C8102E 0px 30px, transparent 30px), linear-gradient(0deg, #C8102E 0px 30px, transparent 30px)",
    bInk: "#7A0E1D",
    hdr: "#F3E3B5",
    artFilter: "contrast(1.2) saturate(1.3)",
    sepia: true,
    duo: false,
    bLight: "#FFFFFF",
    bDark: "#000000",
    drops: 0.4,
    mini: sh("linear-gradient(#C8102E 0px 9px, #F3E3B5 9px 37px, #C8102E 37px)"),
  },
];

const METAL = ["#8E9196", "#E6E8EB", "#B5B8BD", "#7D8086"];
/** Lid and base: the design's elliptical border radii, which RN corners can't take, as SVG. */
function Cap({ w, h, top }: { w: number; h: number; top?: boolean }) {
  const d = top ? `M0 ${h} A${w / 2} ${h} 0 0 1 ${w} ${h} Z` : `M0 0 A${w / 2} ${h} 0 0 0 ${w} 0 Z`;
  return (
    <Svg width={w} height={h} style={{ alignSelf: "center" }}>
      <Defs>
        <LinearGradient id={top ? "lid" : "base"} x1={0} y1={0} x2={1} y2={0}>
          {METAL.map((c, k) => (
            <Stop key={c} offset={[0, 0.3, 0.6, 1][k]} stopColor={c} />
          ))}
        </LinearGradient>
      </Defs>
      <Path d={d} fill={`url(#${top ? "lid" : "base"})`} />
    </Svg>
  );
}

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants()[i];
  const { show } = c;
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        paddingTop: 28,
        paddingHorizontal: 28,
        paddingBottom: 80,
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
      }}
    >
      <View style={{ width: 200, filter: "drop-shadow(0px 22px 22px rgba(0,0,0,0.35))" }}>
        <Cap w={180} h={16} top />
        <View
          style={{
            height: 9,
            marginHorizontal: 3,
            borderRadius: 2,
            experimental_backgroundImage: "linear-gradient(90deg, #9A9DA2, #F0F1F3 30%, #B9BCC1 60%, #83868B)",
          }}
        />
        <View
          style={{
            height: c.n > 100 ? 316 : 350,
            borderRadius: 4,
            backgroundColor: v.label,
            experimental_backgroundImage: v.labelImg,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
            paddingHorizontal: 14,
            paddingBottom: 12,
          }}
        >
          <Ink value={{ ink: v.bInk, sub: v.bInk }}>
            <T style={[font(F.alfa, 10, undefined, 0.14), { color: v.hdr }]}>HALFNOTE BREWING CO.</T>
            {show.art &&
              (v.duo ? (
                <Duotone
                  uri={c.art}
                  light={v.bLight}
                  dark={v.bDark}
                  filter={v.artFilter}
                  style={{ alignSelf: "stretch", marginHorizontal: -14, height: 112 }}
                />
              ) : (
                <Art uri={c.art} filter={v.artFilter} style={{ alignSelf: "stretch", marginHorizontal: -14, height: 112 }}>
                  {v.sepia && (
                    <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(160,100,40,0.35)", mixBlendMode: "multiply" }} />
                  )}
                </Art>
              ))}
            <View style={{ alignItems: "center", gap: 5 }}>
              {show.artist && (
                <>
                  <T style={[font(F.alfa, c.title.length > 14 ? 21 : 27, 1), { textAlign: "center" }]}>{c.title}</T>
                  <T style={[font(F.sans600, 10, undefined, 0.1), { textTransform: "uppercase", textAlign: "center" }]}>
                    Brewed by {c.artist}
                  </T>
                </>
              )}
              {show.rating && (
                <View
                  style={{
                    marginTop: 4,
                    paddingVertical: 3,
                    paddingHorizontal: 12,
                    borderWidth: 2,
                    borderColor: v.bInk,
                    borderRadius: 999,
                  }}
                >
                  <T style={font(F.alfa, 15)}>{c.scoreText}% ABV</T>
                </View>
              )}
            </View>
            <T style={[font(F.sans600, 9, undefined, 0.12), { color: v.hdr }]}>16 FL OZ · ONE PINT</T>
          </Ink>
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              inset: 0,
              experimental_backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(255,255,255,0.32) 16%, rgba(255,255,255,0) 34%, rgba(0,0,0,0.04) 62%, rgba(0,0,0,0.38))",
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              inset: 0,
              opacity: v.drops,
              experimental_backgroundImage:
                "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.8) 0px 2px, transparent 3px), radial-gradient(circle at 70% 55%, rgba(255,255,255,0.7) 0px 1.5px, transparent 2.5px), radial-gradient(circle at 15% 80%, rgba(255,255,255,0.7) 0px 2.5px, transparent 3.5px)",
              experimental_backgroundSize: "46px 58px, 46px 58px, 38px 50px",
            }}
          />
        </View>
        <Cap w={192} h={12} />
      </View>
      {show.head && (
        <View style={{ maxWidth: 300, alignItems: "center", gap: 6 }}>
          <Eyebrow size={11} style={{ letterSpacing: 11 * 0.12 }}>
            Tasting notes
          </Eyebrow>
          <T style={[font(F.serifItalic, c.n <= 60 ? 30 : c.n <= 120 ? 24 : 20, 1.05), { textAlign: "center" }]}>{c.head}</T>
        </View>
      )}
    </View>
  );
}

export const beer: StyleDef = { variants, Layout };
