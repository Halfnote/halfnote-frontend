import type { Ref } from "react";
import { Pressable, TextInput, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { F } from "../story/kit";
import { INK } from "./theme";

export function SearchBar({ value = "", onChangeText, ref }: { value?: string; onChangeText?: (q: string) => void; ref?: Ref<TextInput> }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, height: 46, paddingHorizontal: 14, borderRadius: 10, backgroundColor: "#FFFFFF" }}>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth={1.8} strokeLinecap="round">
        <Circle cx={11} cy={11} r={6.5} />
        <Path d="M16 16 L20 20" />
      </Svg>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        ref={ref}
        editable={!!onChangeText}
        placeholder="Search"
        placeholderTextColor="#8A8A8A"
        accessibilityLabel="Search"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        style={{ flex: 1, height: "100%", fontFamily: F.sans, fontSize: 15, color: INK }}
      />
      {value ? (
        <Pressable onPress={() => onChangeText?.("")} accessibilityLabel="Clear search" hitSlop={8} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#DCDCDC", alignItems: "center", justifyContent: "center" }}>
          <Svg width={10} height={10} viewBox="0 0 14 14" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
            <Path d="M2 2 L12 12 M12 2 L2 12" />
          </Svg>
        </Pressable>
      ) : null}
    </View>
  );
}
