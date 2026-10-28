import { createContext, use, useId, type ReactNode } from "react";
import Svg, { Circle, Defs, Line, Pattern, Rect } from "react-native-svg";
import { Image, Text, View, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from "react-native";

/** Family names registered with useFonts in app/_layout.tsx (they also work in Expo Go). */
export const F = {
  serif: "InstrumentSerif_400Regular",
  serifItalic: "InstrumentSerifItalic",
  sans: "InstrumentSans_400Regular",
  sans500: "InstrumentSans_500Medium",
  sans600: "InstrumentSans_600SemiBold",
  sans700: "InstrumentSans_700Bold",
  mono: "IBMPlexMono_400Regular",
  mono500: "IBMPlexMono_500Medium",
  mono600: "IBMPlexMono_600SemiBold",
  pacifico: "Pacifico_400Regular",
  caveat500: "Caveat_500Medium",
  caveat700: "Caveat_700Bold",
  alfa: "AlfaSlabOne_400Regular",
  pirata: "PirataOne_400Regular",
  marker: "PermanentMarker_400Regular",
  yellowtail: "Yellowtail_400Regular",
};

/** CSS-style type: `lh` is a line-height multiple, `ls` letter-spacing in em. */
export const font = (fontFamily: string, fontSize: number, lh?: number, ls?: number): TextStyle => ({
  fontFamily,
  fontSize,
  lineHeight: lh == null ? undefined : fontSize * lh,
  letterSpacing: ls == null ? undefined : fontSize * ls,
});

/** RN has no colour inheritance across Views, so the design's `color` and `--sub` travel by context. */
export const Ink = createContext({ ink: "#111111", sub: "#5A5A5A" });

/** Text in the current ink; `sub` takes the muted ink. */
export function T({ sub, style, ...props }: TextProps & { sub?: boolean }) {
  const ink = use(Ink);
  return <Text {...props} style={[{ color: sub ? ink.sub : ink.ink }, style]} />;
}

/** Called once per cover when it has drawn (or failed), so a capture never catches an empty square. */
export const ArtSettled = createContext<() => void>(() => {});

/** The album cover, `background: center / cover` in the design. Albums without one get a flat grey square. */
export function Art({
  uri,
  style,
  filter,
  children,
}: {
  uri?: string;
  style?: StyleProp<ViewStyle>;
  filter?: string;
  children?: ReactNode;
}) {
  const settled = use(ArtSettled);
  return (
    <View style={[{ overflow: "hidden", backgroundColor: uri ? undefined : "#BDBDB8" }, style]}>
      {uri ? (
        // Image styles don't take `filter`, so it goes on a wrapping view.
        <View style={{ position: "absolute", inset: 0, filter }}>
          <Image source={{ uri }} resizeMode="cover" onLoad={settled} onError={settled} style={{ width: "100%", height: "100%" }} />
        </View>
      ) : null}
      {children}
    </View>
  );
}

/** The design's `inset 0 0 0 1px` ring, drawn above the cover (an inset boxShadow would sit under the image). */
export const Ring = ({ color = "rgba(17,17,17,0.2)", radius = 2 }: { color?: string; radius?: number }) => (
  <View pointerEvents="none" style={{ position: "absolute", inset: 0, borderWidth: 1, borderColor: color, borderRadius: radius }} />
);

/** A cover with the design's ring and drop shadow. The shadow lives on an outer view so the clip doesn't eat it. */
export function Cover({
  uri,
  size,
  tilt = 0,
  shadow,
  ring = "rgba(17,17,17,0.18)",
  style,
}: {
  uri?: string;
  size: number;
  tilt?: number;
  shadow?: string;
  ring?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ width: size, height: size, borderRadius: 2, boxShadow: shadow, transform: [{ rotate: `${tilt}deg` }] }, style]}>
      <Art uri={uri} style={{ flex: 1, borderRadius: 2 }}>
        <Ring color={ring} />
      </Art>
    </View>
  );
}

/**
 * The design's duotone: a high-contrast grey cover multiplied by the light tone, then lightened by the dark one.
 * `grayscale`/`contrast` render through RN's SwiftUI filter path on iOS; `brightness` is folded in by RN as a multiply layer.
 */
export function Duotone({
  uri,
  light,
  dark,
  filter = "grayscale(1) contrast(2)",
  style,
  children,
}: {
  uri?: string;
  light: string;
  dark: string;
  filter?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return (
    <Art uri={uri} style={[{ isolation: "isolate" }, style]} filter={filter}>
      <View style={{ position: "absolute", inset: 0, backgroundColor: light, mixBlendMode: "multiply" }} />
      <View style={{ position: "absolute", inset: 0, backgroundColor: dark, mixBlendMode: "lighten" }} />
      {children}
    </Art>
  );
}

/** Dot screen: the design's `radial-gradient(c R1, transparent R2) / size size`. */
export const Dots = ({ color, r1, r2, size }: { color: string; r1: number; r2: number; size: number }) => (
  <View
    pointerEvents="none"
    style={{
      position: "absolute",
      inset: 0,
      experimental_backgroundImage: `radial-gradient(${color} ${r1}px, transparent ${r2}px)`,
      experimental_backgroundSize: `${size}px ${size}px`,
    }}
  />
);

export const Eyebrow = ({ children, size = 12, style }: { children: ReactNode; size?: number; style?: StyleProp<TextStyle> }) => (
  <T sub style={[font(F.sans600, size, undefined, 0.08), { textTransform: "uppercase" }, style]}>
    {children}
  </T>
);

/** Artist eyebrow over the serif title, the design's most repeated block. */
export const ArtistTitle = ({
  artist,
  title,
  size = 26,
  align,
}: {
  artist: string;
  title: string;
  size?: number;
  align?: TextStyle["textAlign"];
}) => (
  <View style={{ gap: 4 }}>
    <Eyebrow style={{ textAlign: align }}>{artist}</Eyebrow>
    <T style={[font(F.serif, size, 1), { textAlign: align }]}>{title}</T>
  </View>
);

/** Headline size by length, the design's `n <= 60 ? a : n <= 120 ? b : c`. */
export const bySize = (n: number, a: number, b: number, c: number) => (n <= 60 ? a : n <= 120 ? b : c);

export const DARK_DOTS = "radial-gradient(rgba(17,17,17,0.2) 0.8px, transparent 1px)";
export const LIGHT_DOTS = "radial-gradient(rgba(238,238,238,0.2) 0.8px, transparent 1px)";
export const CREAM = "#F4F1EA";
export const CREAM_SUB = "rgba(244,241,234,0.78)";

/**
 * A record: the design's `repeating-radial-gradient(circle, groove 0 1.6px, land 1.6px 3px)` drawn as SVG rings
 * (RN gradients don't repeat), with the diagonal sheen and a centre label.
 */
export function Vinyl({
  size,
  groove,
  land,
  sheen,
  label,
  labelSize,
  shadow,
  children,
}: {
  size: number;
  groove: string;
  land: string;
  sheen: number;
  label: string;
  labelSize: number;
  shadow: string;
  children?: ReactNode;
}) {
  const r = size / 2;
  const rings = Array.from({ length: Math.floor(r / 3) }, (_, k) => k * 3 + 0.8);
  return (
    <View style={{ width: size, height: size, borderRadius: r, boxShadow: shadow }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle cx={r} cy={r} r={r} fill={land} />
        {rings.map((rr) => (
          <Circle key={rr} cx={r} cy={r} r={rr} stroke={groove} strokeWidth={1.6} fill="none" />
        ))}
      </Svg>
      <View
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          experimental_backgroundImage: `linear-gradient(120deg, transparent 38%, rgba(255,255,255,${sheen}) 48%, transparent 58%)`,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: (size - labelSize) / 2,
          top: (size - labelSize) / 2,
          width: labelSize,
          height: labelSize,
          borderRadius: labelSize / 2,
          backgroundColor: label,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </View>
    </View>
  );
}

/** Ten rating cells: full ones solid, a half point at half strength, the rest faint. */
export const levels = (score: number, faint: number) => {
  const full = Math.floor(score);
  const half = score - full >= 0.5;
  return Array.from({ length: 10 }, (_, k) => (k < full ? 1 : k === full && half ? 0.5 : faint));
};

/** React ids carry punctuation that SVG `url(#…)` references don't survive. */
export const svgId = (reactId: string) => "s" + reactId.replace(/[^a-zA-Z0-9]/g, "");

/**
 * Fills its parent with an SVG pattern tile, standing in for CSS `repeating-*-gradient`s, which RN lacks.
 * `children` draw one `w`×`h` tile.
 */
export function Tile({ w, h, children, style }: { w: number; h: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const id = svgId(useId());
  return (
    <Svg pointerEvents="none" style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }, style]} width="100%" height="100%">
      <Defs>
        <Pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          {children}
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

/** Horizontal lines `thickness` tall every `period`, starting at `offset`: `repeating-linear-gradient(to bottom, …)`. */
export const Lines = ({ color, period, offset, thickness = 1 }: { color: string; period: number; offset: number; thickness?: number }) => (
  <Tile w={period} h={period}>
    <Rect x={0} y={offset} width={period} height={thickness} fill={color} />
  </Tile>
);

/** A dashed rule; iOS only dashes uniform borders, so it's an SVG line. */
export const Dash = ({ color, width = 1.5, opacity = 1 }: { color: string; width?: number; opacity?: number }) => (
  <Svg height={width} width="100%" style={{ opacity }}>
    <Line x1={0} y1={width / 2} x2="100%" y2={width / 2} stroke={color} strokeWidth={width} strokeDasharray={[4, 3]} />
  </Svg>
);
