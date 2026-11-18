import { useNavigation } from "expo-router";
import type { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { BG, INK } from "../components";
import { F } from "../story/kit";

export function TopBar({ title, right }: { title: string; right?: ReactNode }) {
  const navigation = useNavigation();
  // The parent is the root stack, so Cancel closes all of Write instead of popping back to the picker.
  return (
    <View style={shared.bar}>
      <Pressable role="button" onPress={() => navigation.getParent()?.goBack()} hitSlop={8} style={shared.cancel}>
        <Text style={shared.cancelText}>Cancel</Text>
      </Pressable>
      <Text style={shared.barTitle}>{title}</Text>
      <View style={shared.barSide}>{right}</View>
    </View>
  );
}

export function Cover({ uri, style }: { uri?: string; style: object }) {
  return uri ? <Image source={{ uri }} style={style} accessibilityIgnoresInvertColors /> : <View style={[style, shared.noCover]} />;
}

export const byline = (artist: string, year?: number) => (year ? `${artist} · ${year}` : artist);

export const shared = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  bar: { height: 60, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cancel: { minWidth: 64, minHeight: 44, justifyContent: "center", paddingHorizontal: 8 },
  cancelText: { fontFamily: F.sans, fontSize: 15, color: INK },
  barTitle: { fontFamily: F.sans600, fontSize: 15, color: INK },
  barSide: { minWidth: 64, alignItems: "flex-end" },
  noCover: { backgroundColor: "#D8D8D8" },
});
