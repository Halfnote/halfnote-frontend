import { useNavigation } from "expo-router";
import type { SearchResult } from "@halfnote/data";
import type { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { BG, INK } from "../../components";
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

export function AlbumRow({ album, onPress, selected, badge }: { album: SearchResult; onPress: () => void; selected?: boolean; badge?: ReactNode }) {
  return (
    <Pressable role="button" aria-selected={selected} onPress={onPress} style={({ pressed }) => [row.row, pressed && row.rowPressed]}>
      <Cover uri={album.cover_image} style={row.rowCover} />
      <View style={row.rowText}>
        <Text style={row.rowTitle} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={row.meta}>{byline(album.artist, album.year)}</Text>
      </View>
      {badge}
    </Pressable>
  );
}

const row = StyleSheet.create({
  row: { minHeight: 72, padding: 8, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 14 },
  rowPressed: { backgroundColor: "#E4E4E4" },
  rowCover: { width: 56, height: 56, borderRadius: 2 },
  rowText: { flex: 1, minWidth: 0, gap: 3 },
  rowTitle: { fontFamily: F.serif, fontSize: 21, lineHeight: 23, color: INK },
  meta: { fontFamily: F.sans, fontSize: 13, color: "#666" },
});

export const shared = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  bar: { height: 60, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cancel: { minWidth: 64, minHeight: 44, justifyContent: "center", paddingHorizontal: 8 },
  cancelText: { fontFamily: F.sans, fontSize: 15, color: INK },
  barTitle: { fontFamily: F.sans600, fontSize: 15, color: INK },
  barSide: { minWidth: 64, alignItems: "flex-end" },
  noCover: { backgroundColor: "#D8D8D8" },
});
