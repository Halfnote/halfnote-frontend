import { use, useId } from "react";
import { View } from "react-native";
import Svg, { Defs, Image, LinearGradient, Path, Pattern, Stop, Text } from "react-native-svg";
import type { StoryContent } from "../../storyDraft";
import { Art, ArtSettled, DARK_DOTS, svgId, F, font, LIGHT_DOTS, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & {
  sky: string;
  script: string;
  stroke: string;
  palm: string;
  /** Word fill without a cover: [top, bottom]. */
  fill0: [string, string];
  vintage: boolean;
  mark: string;
};

const mini = (ink: string, bg: string) => ({ glyph: "Aloha", font: F.pacifico, size: 17, ink, bg });
const variants = (): [V, V, V] => [
  {
    name: "Sunset",
    bg: "#EAD9BF",
    img: DARK_DOTS,
    ink: "#2B2118",
    sub: "#6E5E4C",
    dark: false,
    sky: "linear-gradient(#FF7E5F, #FFB26B 52%, #FFD9A0 56%, #2E8C9A 56.5%, #1F6F7C)",
    script: "#FFF6E5",
    stroke: "#3B1F1A",
    palm: "rgba(59,31,26,0.85)",
    fill0: ["#FFD23F", "#F25C78"],
    vintage: false,
    mark: "rgba(178,58,42,0.8)",
    mini: mini("#3B1F1A", "linear-gradient(#FF7E5F, #FFB26B 55%, #2E8C9A 55.5%)"),
  },
  {
    name: "Lagoon",
    bg: "#BFE3E0",
    img: DARK_DOTS,
    ink: "#0B3B45",
    sub: "#3F6A70",
    dark: false,
    sky: "linear-gradient(#5ECFE6, #BDF0F2 52%, #E9FBF7 56%, #17A2A2 56.5%, #0B7380)",
    script: "#F2547A",
    stroke: "#073B4C",
    palm: "rgba(7,59,76,0.85)",
    fill0: ["#F2547A", "#FFC94A"],
    vintage: false,
    mark: "rgba(7,59,76,0.75)",
    mini: mini("#073B4C", "linear-gradient(#5ECFE6, #BDF0F2 55%, #17A2A2 55.5%)"),
  },
  {
    name: "Vintage",
    bg: "#3A2F25",
    img: LIGHT_DOTS,
    ink: "#F3E6CF",
    sub: "rgba(243,230,207,0.7)",
    dark: true,
    sky: "linear-gradient(#E6B37E, #F2D3A0 52%, #F6E4C0 56%, #8E9C7C 56.5%, #6B795D)",
    script: "#FFF3DC",
    stroke: "#4A2E1F",
    palm: "rgba(74,46,31,0.85)",
    fill0: ["#C8553D", "#E8B04A"],
    vintage: true,
    mark: "rgba(74,46,31,0.75)",
    mini: mini("#4A2E1F", "linear-gradient(#E6B37E, #F2D3A0 55%, #8E9C7C 55.5%)"),
  },
];

const TRUNK = "M70 150 C 66 110, 62 80, 66 46";
const FRONDS =
  "M66 46 C 46 30, 24 30, 6 44 C 26 36, 46 40, 66 50 Z M66 46 C 84 26, 104 24, 118 36 C 100 32, 84 38, 68 50 Z M66 46 C 58 22, 42 8, 22 6 C 40 14, 54 28, 64 48 Z M66 46 C 78 18, 96 8, 112 10 C 94 18, 80 30, 68 50 Z";
const Palm = ({ color, w, h, big }: { color: string; w: number; h: number; big?: boolean }) => (
  <Svg width={w} height={h} viewBox="0 0 120 150">
    <Path d={TRUNK} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" />
    <Path d={big ? `${FRONDS} M66 46 C 64 26, 70 10, 80 0 C 76 16, 72 30, 68 48 Z` : FRONDS} fill={color} />
  </Svg>
);

const INNER = 292;

/** "Greetings from" word, filled with the cover (CSS background-clip: text) or the variant's gradient, outlined and offset-shadowed. */
function Word({ c, v, top, size, height }: { c: StoryContent; v: V; top: number; size: number; height: number }) {
  const settled = use(ArtSettled);
  const id = svgId(useId());
  const word = c.title.split(" ")[0].toUpperCase().slice(0, 8);
  const cover = c.show.art && c.art;
  const text = (dx: number, fill: string) => (
    <Text
      x={INNER / 2 + dx}
      y={top + size * 0.82 + dx}
      textAnchor="middle"
      fontFamily={F.alfa}
      fontSize={size}
      letterSpacing={size * 0.02}
      fill={fill}
      stroke={v.stroke}
      strokeWidth={2}
    >
      {word}
    </Text>
  );
  return (
    <Svg width={INNER} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
      <Defs>
        <Pattern id={`${id}w`} patternUnits="userSpaceOnUse" x={0} y={top} width={INNER} height={size}>
          {cover && <Image href={{ uri: c.art }} width={INNER} height={size} preserveAspectRatio="xMidYMid slice" onLoad={settled} />}
        </Pattern>
        <LinearGradient id={`${id}g`} x1={0} y1={0} x2={0} y2={1}>
          <Stop offset={0} stopColor={v.fill0[0]} />
          <Stop offset={1} stopColor={v.fill0[1]} />
        </LinearGradient>
      </Defs>
      {text(3, v.stroke)}
      {text(0, `url(#${id}${cover ? "w" : "g"})`)}
    </Svg>
  );
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants()[i];
  const { show } = c;
  const long = c.mode === "long";
  const frontH = long ? 150 : 210;
  const word = c.title.split(" ")[0].slice(0, 8);
  const now = new Date();
  const card = "#FBF7EE";
  return (
    <View style={{ position: "absolute", inset: 0, paddingTop: 30, paddingHorizontal: 28, paddingBottom: 80, alignItems: "center" }}>
      <View
        style={{
          width: 304,
          height: frontH,
          borderRadius: 4,
          boxShadow: "0 18px 30px -16px rgba(0,0,0,0.5)",
          transform: [{ rotate: "-3deg" }],
          zIndex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            borderWidth: 6,
            borderColor: card,
            borderRadius: 4,
            overflow: "hidden",
            experimental_backgroundImage: v.sky,
            filter: v.vintage ? "saturate(0.85)" : undefined,
          }}
        >
          <View style={{ position: "absolute", right: -6, bottom: -4 }}>
            <Palm color={v.palm} w={110} h={140} big />
          </View>
          <View style={{ position: "absolute", left: 4, bottom: -4, transform: [{ scaleX: -1 }] }}>
            <Palm color={v.palm} w={66} h={86} />
          </View>
          <T
            style={[
              font(F.pacifico, 24),
              {
                position: "absolute",
                left: 14,
                top: 8,
                transform: [{ rotate: "-6deg" }],
                color: v.script,
                textShadowColor: v.stroke,
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 0,
              },
            ]}
          >
            Greetings from
          </T>
          <Word c={c} v={v} top={long ? 48 : 72} size={word.length <= 5 ? (long ? 60 : 78) : long ? 44 : 56} height={frontH - 12} />
          {/* iOS has no sepia filter; a warm multiply wash stands in for the design's sepia(0.35). */}
          {v.vintage && (
            <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(112,66,20,0.18)", mixBlendMode: "multiply" }} />
          )}
        </View>
      </View>
      <View
        style={{
          width: 304,
          marginTop: -14,
          backgroundColor: card,
          borderRadius: 4,
          boxShadow: "0 18px 30px -16px rgba(0,0,0,0.5)",
          transform: [{ rotate: "2deg" }],
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: 14,
          gap: 8,
        }}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
          <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
            <T style={[font(F.sans600, 10, undefined, 0.16), { color: "#8A8578" }]}>POST CARD</T>
            {show.artist && (
              <T style={[font(F.caveat700, 22, 1), { color: "#2B2A33" }]}>
                Re: {c.title}, {c.artist}
              </T>
            )}
          </View>
          <View style={{ width: 100, height: 82 }}>
            {show.art && (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: 62,
                  height: 74,
                  padding: 5,
                  backgroundColor: "#FFFFFF",
                  experimental_backgroundImage: `radial-gradient(circle, ${card} 2.2px, transparent 2.6px)`,
                  experimental_backgroundSize: "8px 8px",
                  experimental_backgroundPosition: "-4px -4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}
              >
                <Art uri={c.art} style={{ flex: 1 }} />
              </View>
            )}
            {show.rating && (
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 14,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth: 2,
                  borderColor: v.mark,
                  transform: [{ rotate: "-12deg" }],
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <T style={[font(F.sans600, 7, undefined, 0.12), { color: v.mark }]}>HALFNOTE</T>
                <T style={[font(F.serif, 22, 1), { color: v.mark }]}>{c.scoreText}</T>
                <T style={[font(F.sans600, 7, undefined, 0.08), { color: v.mark }]}>
                  {MONTHS[now.getMonth()]} {now.getDate()} {String(now.getFullYear() % 100).padStart(2, "0")}
                </T>
              </View>
            )}
          </View>
        </View>
        {show.head && (
          <T style={[font(F.caveat700, long ? 22 : c.n <= 60 ? 34 : c.n <= 120 ? 28 : 24, 1.02), { color: "#2B2A33" }]}>{c.head}</T>
        )}
        {show.body && (
          <View style={{ gap: 4 }}>
            {c.paras.map((p, k) => (
              <T key={k} style={[font(F.caveat500, 18, 1.05), { color: "#2B2A33" }]}>
                {p}
              </T>
            ))}
          </View>
        )}
        <T style={[font(F.caveat500, 19), { color: "#2B2A33", paddingTop: 4, borderTopWidth: 1, borderColor: "rgba(43,42,51,0.2)" }]}>
          Wish you were listening.
        </T>
      </View>
    </View>
  );
}

export const postcard: StyleDef = { variants, Layout };
