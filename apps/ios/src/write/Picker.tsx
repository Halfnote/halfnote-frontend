import type { SearchResult } from "@halfnote/data";
import { useRecentlyViewed, useRecordView } from "@halfnote/data/react";
import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { INK } from "../components";
import { F } from "../story/kit";
import { TopBar, shared } from "./bits";
import { Rise } from "./motion";
import { AlbumRow, SEARCH_FAILED, SearchBox, noMatches, useAlbumSearch } from "./search";

export function Picker({ onPick }: { onPick: (album: SearchResult) => void }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const { query, search } = useAlbumSearch(text);
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
  if (list.isError) note = query ? SEARCH_FAILED : "Couldn't load recently viewed albums.";
  else if (!list.isLoading && albums.length === 0)
    note = query ? noMatches(text) : "Albums you open from search show up here.";

  return (
    <View style={[shared.screen, { paddingTop: insets.top }]}>
      <TopBar title="New review" />
      <View style={s.pickHead}>
        <Text style={s.pickTitle}>What are you listening to?</Text>
        <SearchBox value={text} onChangeText={setText} autoFocus />
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

const s = StyleSheet.create({
  pickHead: { paddingTop: 4, paddingHorizontal: 20 },
  pickTitle: { marginBottom: 14, fontFamily: F.serif, fontSize: 34, lineHeight: 36, color: INK },
  listLabel: { marginTop: 20, marginBottom: 6, fontFamily: F.sans600, fontSize: 13, color: "#6A6A6A" },
  list: { paddingHorizontal: 12 },
  stale: { opacity: 0.5 },
  spinner: { marginTop: 24 },
  note: { marginVertical: 18, marginHorizontal: 8, fontFamily: F.sans, fontSize: 14, lineHeight: 21, color: "#666" },
});
