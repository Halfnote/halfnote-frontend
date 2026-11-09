import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { StoryContent } from "../../storyDraft";
import { Art, Dots, Eyebrow, F, font, Ink, T } from "../kit";
import type { StyleDef, Variant } from "./types";

type V = Variant & {
  open: boolean;
  coverIn: string;
  coverOut: string;
  coverInk: string;
  baseInk: string;
  head: string;
  stick: string;
  seal: string;
  sealInk: string;
};

const sh = (bg: string) => ({ sh: [30, 44, 3, bg] as [number, number, number, string] });
const variants = (): [V, V, V] => [
  {
    // RN gradients don't repeat, so wood grain is one stripe per tile; the design tilts it 2°.
    name: "Bar",
    bg: "#2A1E17",
    img: "linear-gradient(90deg, rgba(255,255,255,0.035) 0px 2px, transparent 2px)",
    size: "7px 7px",
    ink: "#F3E6CF",
    sub: "rgba(243,230,207,0.72)",
    dark: true,
    open: true,
    coverIn: "#F2E6CF",
    coverOut: "#1C1C1C",
    coverInk: "#F2E6CF",
    baseInk: "#F2E6CF",
    head: "#C8312B",
    stick: "#E9DCC0",
    seal: "#C8312B",
    sealInk: "#F2E6CF",
    mini: sh("linear-gradient(#F2E6CF 0px 50%, #1C1C1C 50%)"),
  },
  {
    name: "Diner",
    bg: "#D9CBB0",
    img: "radial-gradient(rgba(140,60,40,0.18) 1px, transparent 1.5px), radial-gradient(rgba(30,60,90,0.15) 1px, transparent 1.5px)",
    size: "9px 9px, 13px 13px",
    ink: "#2A1E17",
    sub: "#5E4E3E",
    dark: false,
    open: false,
    coverIn: "#F6EAD0",
    coverOut: "#B3261E",
    coverInk: "#F6EAD0",
    baseInk: "#F6EAD0",
    head: "#1F3A5F",
    stick: "#EFE6D2",
    seal: "#F6EAD0",
    sealInk: "#B3261E",
    mini: sh("#B3261E"),
  },
  {
    name: "Motel",
    bg: "#2E5E5A",
    ink: "#F2EBDD",
    sub: "rgba(242,235,221,0.75)",
    dark: true,
    open: true,
    coverIn: "#1A1A1A",
    coverOut: "#1A1A1A",
    coverInk: "#E8B33A",
    baseInk: "#E8B33A",
    head: "#E8B33A",
    stick: "#D8CBB0",
    seal: "#E8B33A",
    sealInk: "#1A1A1A",
    mini: sh("linear-gradient(#1A1A1A 0px 50%, #E8B33A 50% 54%, #1A1A1A 54%)"),
  },
];

const BURNT_HEAD = "radial-gradient(circle at 40% 35%, #4A3A30, #141210 70%)";
const charred = (stick: string, a: number, b: number, c: number) => `linear-gradient(#211A15 0px ${a}px, #5C3F2B ${b}px, ${stick} ${c}px)`;

/** Striker strip: the design's 100° score marks, as one vertical mark per tile, over grit and wood. */
const STRIKER = {
  experimental_backgroundImage:
    "linear-gradient(90deg, transparent 0px 18px, rgba(0,0,0,0.35) 18px 20px), radial-gradient(rgba(255,255,255,0.18) 0.7px, transparent 1px), linear-gradient(#5A3E2B, #3E2A1D)",
  experimental_backgroundSize: "20px 20px, 3px 3px, 100% 100%",
} as const;

function Base({ v, height, shade }: { v: V; height: number; shade?: boolean }) {
  return (
    <View
      style={[
        { height, backgroundColor: v.coverOut, overflow: "hidden" },
        shade
          ? {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              borderTopWidth: 1,
              borderColor: "rgba(0,0,0,0.25)",
              experimental_backgroundImage: "linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.04))",
            }
          : { borderTopLeftRadius: 2, borderTopRightRadius: 2, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
      ]}
    >
      <View
        style={{
          position: "absolute",
          left: "50%",
          top: 7,
          width: 40,
          height: 4,
          marginLeft: -20,
          borderRadius: 2,
          experimental_backgroundImage: "linear-gradient(#C9C9C9, #7A7A7A)",
        }}
      />
      <T
        style={[
          font(F.sans600, 8, undefined, 0.14),
          { position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", color: v.baseInk },
        ]}
      >
        CLOSE COVER BEFORE STRIKING
      </T>
      <View style={[{ position: "absolute", left: 0, right: 0, bottom: 0, height: 20 }, STRIKER]} />
    </View>
  );
}

function Seal({ v, size, scoreSize, style, score }: { v: V; size: number; scoreSize: number; style: object; score: string }) {
  return (
    <View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: v.seal,
          transform: [{ rotate: "-10deg" }],
          boxShadow: "0 6px 12px -6px rgba(0,0,0,0.6)",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <T style={[font(F.sans600, 7, undefined, 0.14), { color: v.sealInk }]}>RATED</T>
      <T style={[font(F.alfa, scoreSize, 1), { color: v.sealInk }]}>{score}</T>
    </View>
  );
}

const Cover = ({ uri }: { uri?: string }) => (
  <Art uri={uri} filter="saturate(0.9) contrast(1.05)" style={{ position: "absolute", inset: 0 }}>
    <Dots color="rgba(255,255,255,0.16)" r1={0.7} r2={1} size={3} />
  </Art>
);

/** A comb of paper matches: a few burnt down, one torn out. */
function Matches({ v }: { v: V }) {
  return Array.from({ length: 10 }, (_, i) => {
    const burnt = [1, 4, 5].includes(i);
    const torn = i === 7;
    const h = torn ? 18 : burnt ? 86 + (i % 2) * 10 : 124;
    return (
      <View
        key={i}
        style={{
          position: "absolute",
          left: 6 + i * 24,
          bottom: 0,
          width: 16,
          height: h,
          transform: [{ rotate: `${burnt ? (i % 2 ? 4 : -5) : 0}deg` }],
          transformOrigin: "bottom",
        }}
      >
        {torn ? (
          <Svg width={16} height={10} style={{ position: "absolute", bottom: 0 }}>
            <Path d="M0 3 L4 0 L8 3.5 L12 0.5 L16 3 L16 10 L0 10 Z" fill={v.stick} />
          </Svg>
        ) : (
          <>
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                top: 8,
                backgroundColor: burnt ? undefined : v.stick,
                experimental_backgroundImage: burnt ? charred(v.stick, 18, 34, 56) : undefined,
                boxShadow: "inset -2px 0 0 rgba(0,0,0,0.08)",
              }}
            />
            <View
              style={{
                position: "absolute",
                left: -2,
                top: -6,
                width: 20,
                height: 24,
                borderRadius: 10,
                backgroundColor: burnt ? undefined : v.head,
                experimental_backgroundImage: burnt ? BURNT_HEAD : undefined,
                boxShadow: "inset -2px -3px 0 rgba(0,0,0,0.18)",
              }}
            />
          </>
        )}
      </View>
    );
  });
}

const LOOSE = [
  { x: 214, y: 54, rot: 28, burnt: true },
  { x: 236, y: 92, rot: 58, burnt: true },
  { x: 200, y: 168, rot: -14, burnt: true },
  { x: 250, y: 210, rot: 72, burnt: false },
];

function Layout({ c, i }: { c: StoryContent; i: number }) {
  const v = variants()[i];
  const { show } = c;
  return (
    <View
      style={{ position: "absolute", inset: 0, paddingTop: 30, paddingHorizontal: 24, paddingBottom: 80, alignItems: "center", gap: 18 }}
    >
      {v.open ? (
        <View style={{ width: 252, filter: "drop-shadow(0px 22px 24px rgba(0,0,0,0.45))" }}>
          <View
            style={{
              height: c.n > 100 ? 130 : 170,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              backgroundColor: v.coverIn,
              padding: 10,
              overflow: "hidden",
            }}
          >
            {show.art && (
              <View style={{ flex: 1, borderRadius: 2, overflow: "hidden" }}>
                <Cover uri={c.art} />
              </View>
            )}
            {!show.art && show.artist && (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 6 }}>
                <T style={[font(F.alfa, 26, 1), { color: v.coverInk, textAlign: "center" }]}>{c.title}</T>
                <T style={[font(F.sans600, 11, undefined, 0.1), { color: v.coverInk, textTransform: "uppercase", textAlign: "center" }]}>
                  {c.artist}
                </T>
              </View>
            )}
            {show.rating && <Seal v={v} size={62} scoreSize={20} score={c.scoreText} style={{ right: 16, bottom: 16 }} />}
          </View>
          <View
            style={{
              height: 7,
              marginHorizontal: 3,
              backgroundColor: v.coverOut,
              experimental_backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0))",
            }}
          />
          <View style={{ height: 128, marginHorizontal: 7 }}>
            <Matches v={v} />
          </View>
          <Base v={v} height={66} />
        </View>
      ) : (
        <View style={{ width: 300, height: 356 }}>
          <View
            style={{
              position: "absolute",
              left: 24,
              top: 8,
              width: 212,
              height: 330,
              transform: [{ rotate: "-5deg" }],
              borderRadius: 6,
              backgroundColor: v.coverOut,
              boxShadow: "inset -4px 0 0 rgba(0,0,0,0.15), 0 24px 30px -16px rgba(0,0,0,0.55)",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 12,
                right: 12,
                top: 12,
                height: 188,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.12)",
                overflow: "hidden",
              }}
            >
              {show.art && <Cover uri={c.art} />}
            </View>
            {show.rating && <Seal v={v} size={58} scoreSize={19} score={c.scoreText} style={{ right: 10, top: 160 }} />}
            {show.artist && (
              <Ink value={{ ink: v.coverInk, sub: v.coverInk }}>
                <View style={{ position: "absolute", left: 14, right: 14, top: 210, gap: 4 }}>
                  <T style={font(F.alfa, 20, 1)}>{c.title}</T>
                  <T style={[font(F.sans600, 10, undefined, 0.1), { textTransform: "uppercase" }]}>{c.artist}</T>
                </View>
              </Ink>
            )}
            <Base v={v} height={70} shade />
          </View>
          {LOOSE.map((m) => (
            <View
              key={m.x}
              style={{
                position: "absolute",
                left: m.x,
                top: m.y,
                width: 14,
                height: m.burnt ? 92 : 120,
                transform: [{ rotate: `${m.rot}deg` }],
                filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.35))",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 8,
                  backgroundColor: m.burnt ? undefined : v.stick,
                  experimental_backgroundImage: m.burnt ? charred(v.stick, 16, 30, 48) : undefined,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  left: -2,
                  top: -5,
                  width: 18,
                  height: 22,
                  borderRadius: 9,
                  backgroundColor: m.burnt ? undefined : v.head,
                  experimental_backgroundImage: m.burnt ? BURNT_HEAD : undefined,
                }}
              />
            </View>
          ))}
        </View>
      )}
      {v.open && show.art && show.artist && (
        <Eyebrow style={{ textAlign: "center" }}>
          {c.artist} · {c.title}
        </Eyebrow>
      )}
      {show.head && (
        <T style={[font(F.serifItalic, c.n <= 60 ? 30 : c.n <= 120 ? 24 : 20, 1.05), { maxWidth: 304, textAlign: "center" }]}>“{c.head}”</T>
      )}
    </View>
  );
}

export const matchbook: StyleDef = { variants, Layout };
