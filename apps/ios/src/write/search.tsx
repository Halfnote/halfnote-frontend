import type { SearchResult } from "@halfnote/data";
import { useDebounce, useSearchAlbums } from "@halfnote/data/react";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { INK } from "../components";
import { F } from "../story/kit";
import { Cover, byline } from "./bits";

/** `query` is "" until there is enough text to search for. */
export function useAlbumSearch(text: string) {
  const debounced = useDebounce(text.trim().toLowerCase(), 500);
  const query = debounced.length >= 2 ? debounced : "";
  return { query, search: useSearchAlbums(query) };
}

export const SEARCH_FAILED = "Search isn't working right now. Try again in a moment.";
export const noMatches = (text: string) => `Nothing matches “${text.trim()}”. Try an artist name.`;

export function SearchBox({ value, onChangeText, autoFocus }: { value: string; onChangeText: (text: string) => void; autoFocus?: boolean }) {
  return (
    <View style={s.box}>
      <Svg width={17} height={17} viewBox="0 0 20 20" fill="none" stroke="#6A6A6A" strokeWidth={1.7} strokeLinecap="round">
        <Circle cx={8.5} cy={8.5} r={6} />
        <Path d="M13 13 L18 18" />
      </Svg>
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search albums or artists"
        placeholderTextColor="#8A8A8A"
        accessibilityLabel="Search albums"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
    </View>
  );
}

export function AlbumRow({ album, onPress, selected, badge }: { album: SearchResult; onPress: () => void; selected?: boolean; badge?: ReactNode }) {
  return (
    <Pressable role="button" aria-selected={selected} onPress={onPress} style={({ pressed }) => [s.row, pressed && s.rowPressed]}>
      <Cover uri={album.cover_image} style={s.rowCover} />
      <View style={s.rowText}>
        <Text style={s.rowTitle} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={s.meta}>{byline(album.artist, album.year)}</Text>
      </View>
      {badge}
    </Pressable>
  );
}

const s = StyleSheet.create({
  box: { flexDirection: "row", alignItems: "center", gap: 10, height: 48, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#FFFFFF" },
  input: { flex: 1, minWidth: 0, fontFamily: F.sans, fontSize: 16, color: INK },
  row: { minHeight: 72, padding: 8, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 14 },
  rowPressed: { backgroundColor: "#E4E4E4" },
  rowCover: { width: 56, height: 56, borderRadius: 2 },
  rowText: { flex: 1, minWidth: 0, gap: 3 },
  rowTitle: { fontFamily: F.serif, fontSize: 21, lineHeight: 23, color: INK },
  meta: { fontFamily: F.sans, fontSize: 13, color: "#666" },
});
