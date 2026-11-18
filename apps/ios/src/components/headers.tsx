import { router } from "expo-router";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { F, font } from "../story/kit";
import { PixelBack } from "./icons";
import { BG, INK } from "./theme";

export function PageHeader({ title, background = BG }: { title: string; background?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: background, flexDirection: "row", alignItems: "center", gap: 12, height: 64 + insets.top, paddingLeft: 8, paddingRight: 14 }}>
      <Pressable onPress={() => router.back()} accessibilityLabel="Back" style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
        <PixelBack />
      </Pressable>
      <Text numberOfLines={1} style={{ flex: 1, fontFamily: F.sans600, fontSize: 22, color: INK }}>
        {title}
      </Text>
    </View>
  );
}

export function SectionHeader({ title, kicker, style }: { title: string; kicker?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }, style]}>
      <Text style={[font(F.serif, 28, 1), { color: INK }]}>{title}</Text>
      {kicker ? <Text style={{ fontFamily: F.sans, fontSize: 12, color: "#666" }}>{kicker}</Text> : null}
    </View>
  );
}
