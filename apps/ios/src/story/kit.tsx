import { createContext, use, type ReactNode } from "react";
import { Image, Text, View, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from "react-native";

/** Family names registered with useFonts in app/_layout.tsx (they also work in Expo Go). */
export const F = {
  serif: "InstrumentSerif_400Regular",
  serifItalic: "InstrumentSerifItalic",
  sans: "InstrumentSans_400Regular",
  sans500: "InstrumentSans_500Medium",
  sans600: "InstrumentSans_600SemiBold",
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
