import type { SearchResult } from "@halfnote/data";
import { useDebounce, useRecentlyViewed, useRecordView, useSearchAlbums } from "@halfnote/data/react";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { INK } from "../components";
import { F } from "../story/kit";
import { Cover, TopBar, byline, shared } from "./bits";
import { Rise } from "./motion";

export function Picker({ onPick }: { onPick: (album: SearchResult) => void }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const debounced = useDebounce(text.trim().toLowerCase(), 500);
  const query = debounced.length >= 2 ? debounced : "";
  const search = useSearchAlbums(query);
  const recent = useRecentlyViewed();
  const recordView = useRecordView();
  const list = query ? search : recent;
  const albums = list.data?.results ?? [];

  const pick = (album: SearchResult) => {
    recordView.mutate(String(album.id)); // fire-and-forget: the composer never waits on it
    onPick(album);
  };

  const label = query ? (albums.length === 1 ? "1 album" : `${albums.length} albums`) : "Recently viewed";
  let note: string | null = null;
  if (list.isError) note = query ? "Search isn't working right now. Try again in a moment." : "Couldn't load recently viewed albums.";
  else if (!list.isLoading && albums.length === 0)
    note = query ? `Nothing matches “${text.trim()}”. Try an artist name.` : "Albums you open from search show up here.";

  return (
    <View style={[shared.screen, { paddingTop: insets.top }]}>
      <TopBar title="New review" />
      <View style={s.pickHead}>
        <Text style={s.pickTitle}>What are you listening to?</Text>
        <View style={s.searchBox}>
          <Svg width={17} height={17} viewBox="0 0 20 20" fill="none" stroke="#6A6A6A" strokeWidth={1.7} strokeLinecap="round">
            <Circle cx={8.5} cy={8.5} r={6} />
            <Path d="M13 13 L18 18" />
          </Svg>
          <TextInput
            style={s.searchInput}
            value={text}
            onChangeText={setText}
            placeholder="Search albums or artists"
            placeholderTextColor="#8A8A8A"
            accessibilityLabel="Search albums"
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
        </View>
        <Text style={s.listLabel}>{label}</Text>
      </View>
      <FlatList
        data={albums}
        keyExtractor={(a) => String(a.id)}
        style={query && search.isPlaceholderData ? s.stale : undefined}
        contentContainerStyle={[s.list, { paddingBottom: 32 + insets.bottom }]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => (
          <Rise delay={Math.min(index, 8) * 30}>
            <AlbumRow album={item} onPress={() => pick(item)} />
          </Rise>
        )}
        ListEmptyComponent={list.isLoading ? <ActivityIndicator style={s.spinner} /> : note ? <Text style={s.note}>{note}</Text> : null}
      />
    </View>
  );
}

function AlbumRow({ album, onPress }: { album: SearchResult; onPress: () => void }) {
  return (
    <Pressable role="button" onPress={onPress} style={({ pressed }) => [s.row, pressed && s.rowPressed]}>
      <Cover uri={album.cover_image} style={s.rowCover} />
      <View style={s.rowText}>
        <Text style={s.rowTitle} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={s.meta}>{byline(album.artist, album.year)}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  pickHead: { paddingTop: 4, paddingHorizontal: 20 },
  pickTitle: { marginBottom: 14, fontFamily: F.serif, fontSize: 34, lineHeight: 36, color: INK },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10, height: 48, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#FFFFFF" },
  searchInput: { flex: 1, minWidth: 0, fontFamily: F.sans, fontSize: 16, color: INK },
  listLabel: { marginTop: 20, marginBottom: 6, fontFamily: F.sans600, fontSize: 13, color: "#6A6A6A" },
  list: { paddingHorizontal: 12 },
  stale: { opacity: 0.5 },
  spinner: { marginTop: 24 },
  note: { marginVertical: 18, marginHorizontal: 8, fontFamily: F.sans, fontSize: 14, lineHeight: 21, color: "#666" },
  row: { minHeight: 72, padding: 8, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 14 },
  rowPressed: { backgroundColor: "#E4E4E4" },
  rowCover: { width: 56, height: 56, borderRadius: 2 },
  rowText: { flex: 1, minWidth: 0, gap: 3 },
  rowTitle: { fontFamily: F.serif, fontSize: 21, lineHeight: 23, color: INK },
  meta: { fontFamily: F.sans, fontSize: 13, color: "#666" },
});
