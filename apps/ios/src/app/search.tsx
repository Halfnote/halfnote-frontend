import { router, useNavigation, type NativeStackNavigationProp } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BG, ItemRow, PixelBack, SearchBar } from "../components";
import { Art, F } from "../features/story/kit";
import { useAlbumSearch } from "../lib/useAlbumSearch";

export default function Search() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const input = useRef<TextInput>(null);
  const [q, setQ] = useState("");

  // autoFocus raises the keyboard mid-push and the two animations stutter; focus once the page has landed.
  useEffect(() => navigation.addListener("transitionEnd", (e) => !e.data.closing && input.current?.focus()), [navigation]);
  const { query, search } = useAlbumSearch(q, 300);
  const results = q.trim() ? (search.data?.results ?? []) : [];

  let label = "";
  if (search.isError) label = "Search isn't working right now.";
  else if (query && !search.isFetching) label = results.length === 1 ? "1 album" : results.length ? `${results.length} albums` : "No matches yet";

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: BG }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 12, paddingLeft: 8, paddingRight: 20 }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Back" style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <PixelBack />
        </Pressable>
        <View style={{ flex: 1 }}>
          <SearchBar ref={input} value={q} onChangeText={setQ} />
        </View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 + insets.bottom }}>
        <Text style={{ paddingTop: 6, paddingBottom: 8, fontFamily: F.sans600, fontSize: 12, color: "#666" }}>{label}</Text>
        {results.map((r) => (
          <View key={r.id} style={{ minHeight: 64, paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#DFDFDF", justifyContent: "center" }}>
            <ItemRow
              lead={<Art uri={r.cover_image ?? r.thumb} style={{ width: 48, height: 48, borderRadius: 2 }} />}
              title={r.title}
              subtitle={r.year ? `${r.artist} · ${r.year}` : r.artist}
              rating={r.average_rating == null ? null : Math.round(r.average_rating)}
              stampSize={36}
              onPress={() => router.push(`/album/${r.id}`)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
