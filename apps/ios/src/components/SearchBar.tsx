import type { Ref } from "react";
import { Pressable, TextInput, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { F } from "../features/story/kit";
import { INK } from "./theme";

const VARIANTS = {
  discover: {
    box: { height: 46, borderRadius: 10 },
    icon: { size: 18, viewBox: "0 0 24 24", stroke: "#555", strokeWidth: 1.8, circle: { cx: 11, cy: 11, r: 6.5 }, handle: "M16 16 L20 20" },
    input: { height: "100%", fontSize: 15 },
    placeholder: "Search",
    label: "Search",
  },
  picker: {
    box: { height: 48, borderRadius: 12 },
    icon: { size: 17, viewBox: "0 0 20 20", stroke: "#6A6A6A", strokeWidth: 1.7, circle: { cx: 8.5, cy: 8.5, r: 6 }, handle: "M13 13 L18 18" },
    input: { minWidth: 0, fontSize: 16 },
    placeholder: "Search albums or artists",
    label: "Search albums",
  },
} as const;

/** Without onChangeText the bar is read-only, for use as a button that opens search. */
export function SearchBar({
  value = "",
  onChangeText,
  ref,
  autoFocus,
  variant = "discover",
}: {
  value?: string;
  onChangeText?: (q: string) => void;
  ref?: Ref<TextInput>;
  autoFocus?: boolean;
  variant?: keyof typeof VARIANTS;
}) {
  const v = VARIANTS[variant];
  const { icon } = v;
  return (
    <View style={[{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, backgroundColor: "#FFFFFF" }, v.box]}>
      <Svg width={icon.size} height={icon.size} viewBox={icon.viewBox} fill="none" stroke={icon.stroke} strokeWidth={icon.strokeWidth} strokeLinecap="round">
        <Circle {...icon.circle} />
        <Path d={icon.handle} />
      </Svg>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        ref={ref}
        editable={!!onChangeText}
        autoFocus={autoFocus}
        placeholder={v.placeholder}
        placeholderTextColor="#8A8A8A"
        accessibilityLabel={v.label}
        autoCapitalize="none"
        autoCorrect={false}
        // The picker uses the native clear button; discover draws its own below.
        clearButtonMode={variant === "picker" ? "while-editing" : "never"}
        returnKeyType="search"
        style={[{ flex: 1, fontFamily: F.sans, color: INK }, v.input]}
      />
      {variant === "discover" && value ? (
        <Pressable onPress={() => onChangeText?.("")} accessibilityLabel="Clear search" hitSlop={8} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#DCDCDC", alignItems: "center", justifyContent: "center" }}>
          <Svg width={10} height={10} viewBox="0 0 14 14" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
            <Path d="M2 2 L12 12 M12 2 L2 12" />
          </Svg>
        </Pressable>
      ) : null}
    </View>
  );
}
