import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import type { StoryContent } from "../../storyDraft";
import { Art, Duotone, F, font, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & {
  shell: string;
  label: string;
  labelImg?: string;
  labelSize?: string;
  labelInk: string;
  jcard: string;
  jInk: string;
  /** J-card face at weight 600, and the regular face. */
  jBold: string;
  artFilter: string;
  duo: boolean;
  light: string;
  dark2: string;
  /** Headline: Instrument Serif italic, or Caveat. */
  caveat: boolean;
  handBold: string;
  hand: string;
};

const sh = (bg: string) => ({ sh: [54, 34, 5, bg] as [number, number, number, string] });
const variants = (): [V, V, V] => [
  {
    name: "Ferric",
    bg: "#CFC7B6",
    ink: "#1F1A14",
    sub: "#5A5246",
    dark: false,
    shell: "linear-gradient(135deg, rgba(40,40,40,0.55), rgba(20,20,20,0.72))",
    label: "#F7F3E8",
    labelInk: "#1F2A44",
    jcard: "#F7F3E8",
    jInk: "#111111",
    jBold: F.sans600,
    artFilter: "saturate(0.9)",
    duo: false,
    light: "#FFFFFF",
    dark2: "#000000",
    caveat: false,
    handBold: F.caveat700,
    hand: F.caveat500,
    mini: sh("linear-gradient(135deg, #555, #222)"),
  },
  {
    name: "Chrome",
    bg: "#141414",
    ink: "#EEEEEE",
    sub: "#A6A6A6",
    dark: true,
    shell: "linear-gradient(135deg, #2E2E2E, #0C0C0C)",
    label: "#B8902F",
    labelImg: "linear-gradient(135deg, #E9C766, #B8902F)",
    labelInk: "#1A1408",
    jcard: "#1E1E1E",
    jInk: "#EEEEEE",
    jBold: F.sans600,
    artFilter: "grayscale(1) contrast(1.6)",
    duo: true,
    light: "#D9B44A",
    dark2: "#1E1E1E",
    caveat: false,
    handBold: F.sans700,
    hand: F.sans,
    mini: sh("linear-gradient(#2E2E2E 0px 30%, #D9B44A 30% 62%, #0C0C0C 62%)"),
  },
  {
    name: "Mixtape",
    bg: "#F2D7DF",
    ink: "#2B3A8C",
    sub: "#5A64A0",
    dark: false,
    shell: "linear-gradient(135deg, rgba(243,140,170,0.88), rgba(214,96,138,0.92))",
    // Ruled notebook label: one rule per 14px tile, since RN gradients don't repeat.
    label: "#FFFDF6",
    labelImg: "linear-gradient(transparent 0px 13px, #B9D3EA 13px 14px)",
    labelSize: "100% 14px",
    labelInk: "#2B3A8C",
    jcard: "#FFFDF6",
    jInk: "#2B3A8C",
    jBold: F.caveat700,
    artFilter: "grayscale(1) contrast(1.7)",
    duo: true,
    light: "#F7C6D3",
    dark2: "#2B3A8C",
    caveat: true,
    handBold: F.caveat700,
    hand: F.caveat500,
    mini: sh("linear-gradient(135deg, #F38CAA, #D6608A)"),
  },
];

/** A tape reel: the design's `repeating-conic-gradient` spokes, which RN lacks, as SVG wedges. */
function Reel({ side }: { side: "left" | "right" }) {
  const wedge = (k: number) => {
    const a = (k * 40 * Math.PI) / 180;
    const b = ((k * 40 + 20) * Math.PI) / 180;
    return `M17 17 L${17 + 17 * Math.sin(a)} ${17 - 17 * Math.cos(a)} A17 17 0 0 1 ${17 + 17 * Math.sin(b)} ${17 - 17 * Math.cos(b)} Z`;
  };
  return (
    <Svg width={34} height={34} style={{ position: "absolute", top: 4, [side]: 6 }}>
      <Circle cx={17} cy={17} r={17} fill="#9A9A9A" />
      <Path d={Array.from({ length: 9 }, (_, k) => wedge(k)).join(" ")} fill="#EEEEEE" />
      <Circle cx={17} cy={17} r={6} fill="#222" />
    </Svg>
  );
}

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants()[i];
  const { show } = c;
  const caseH = c.n > 100 ? 150 : 172;
  const screw = {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    experimental_backgroundImage: "radial-gradient(#DDD, #777)",
  } as const;
  const jText = { color: v.jInk };
  const label = { color: v.labelInk };
  return (
    <View
      style={{ position: "absolute", inset: 0, paddingTop: 32, paddingHorizontal: 30, paddingBottom: 80, alignItems: "center", gap: 22 }}
    >
      <View
        style={{
          width: 296,
          height: caseH,
          transform: [{ rotate: "-3deg" }],
          borderRadius: 4,
          backgroundColor: v.jcard,
          boxShadow: "0 0 0 3px rgba(255,255,255,0.35), 0 20px 30px -16px rgba(0,0,0,0.5)",
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        {show.art &&
          (v.duo ? (
            <Duotone uri={c.art} light={v.light} dark={v.dark2} filter={v.artFilter} style={{ width: caseH, height: "100%" }} />
          ) : (
            <Art uri={c.art} filter={v.artFilter} style={{ width: caseH, height: "100%" }} />
          ))}
        <View style={{ flex: 1, minWidth: 0, padding: 12, justifyContent: "space-between" }}>
          {show.artist && (
            <View style={{ gap: 3 }}>
              <T style={[font(v.jBold, 11, undefined, 0.08), jText, { textTransform: "uppercase", opacity: 0.75 }]}>{c.artist}</T>
              <T style={[font(F.serif, 22, 1), jText]}>{c.title}</T>
            </View>
          )}
          {show.rating && <T style={[font(F.serif, 40, 0.8), jText]}>{c.scoreText}</T>}
          <T style={[font(v.jBold, 10, undefined, 0.12), jText, { opacity: 0.6 }]}>TYPE II · C46</T>
        </View>
        <View
          style={{
            position: "absolute",
            inset: 0,
            experimental_backgroundImage:
              "linear-gradient(115deg, rgba(255,255,255,0.32), transparent 32%, transparent 70%, rgba(255,255,255,0.12))",
          }}
        />
      </View>
      <View
        style={{
          width: 296,
          height: 184,
          transform: [{ rotate: "3deg" }],
          borderRadius: 10,
          experimental_backgroundImage: v.shell,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18), 0 22px 30px -16px rgba(0,0,0,0.55)",
        }}
      >
        <View style={[screw, { left: 7, top: 7 }]} />
        <View style={[screw, { right: 7, top: 7 }]} />
        <View style={[screw, { left: 7, bottom: 7 }]} />
        <View style={[screw, { right: 7, bottom: 7 }]} />
        <View
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            top: 12,
            height: 94,
            borderRadius: 5,
            backgroundColor: v.label,
            experimental_backgroundImage: v.labelImg,
            experimental_backgroundSize: v.labelSize,
            paddingVertical: 8,
            paddingHorizontal: 12,
            flexDirection: "row",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderWidth: 2,
              borderColor: v.labelInk,
              borderRadius: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <T style={[font(F.alfa, 13), label]}>A</T>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <T numberOfLines={1} style={[font(v.handBold, 24, 1.05), label]}>
              {show.artist ? c.title : "Side A"}
            </T>
            <T numberOfLines={1} style={[font(v.hand, 18, 1.05), label]}>
              {show.artist ? c.artist : "for you"}
            </T>
          </View>
          {show.rating && (
            <View
              style={{
                paddingVertical: 2,
                paddingHorizontal: 8,
                borderWidth: 2,
                borderColor: v.labelInk,
                borderRadius: "50%",
                transform: [{ rotate: "-8deg" }],
              }}
            >
              <T style={[font(v.handBold, 20), label]}>{c.scoreText}</T>
            </View>
          )}
        </View>
        <View
          style={{
            position: "absolute",
            left: 66,
            right: 66,
            top: 114,
            height: 42,
            borderRadius: 21,
            backgroundColor: "rgba(18,18,18,0.82)",
            boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}
        >
          <View style={{ position: "absolute", left: 30, right: 30, bottom: 6, height: 14, backgroundColor: "#5A3A26" }} />
          <Reel side="left" />
          <Reel side="right" />
        </View>
        <Svg width={172} height={20} style={{ position: "absolute", left: 62, bottom: 0 }}>
          <Path d="M13.76 0 L158.24 0 L172 20 L0 20 Z" fill="rgba(0,0,0,0.22)" />
        </Svg>
      </View>
      {show.head && (
        <T
          style={[
            v.caveat
              ? font(F.caveat500, c.n <= 60 ? 36 : c.n <= 120 ? 28 : 23, 1.05)
              : font(F.serifItalic, c.n <= 60 ? 30 : c.n <= 120 ? 24 : 20, 1.05),
            { maxWidth: 300, textAlign: "center" },
          ]}
        >
          {c.head}
        </T>
      )}
    </View>
  );
}

export const cassette: StyleDef = { variants, Layout };
