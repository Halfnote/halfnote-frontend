import { useDebounce, useSearchAlbums, useSearchUsers } from "@halfnote/data/react";
import type { SearchResult } from "@halfnote/data";
import { SmallAlbumCard, SmallArtistCard, SmallUserCard, tw } from "@halfnote/ui";
import { router, Stack } from "expo-router";
import { useState, type ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { logout } from "../../session";

export default function Search() {
  const [text, setText] = useState("");
  const debounced = useDebounce(text.trim().toLowerCase(), 500);
  // One request per pause in typing, not per key; lowercase so "Radiohead" and "radiohead" share a cache entry.
  const query = debounced.length >= 2 ? debounced : "";
  const albums = useSearchAlbums(query);
  const users = useSearchUsers(query);
  const albumList = albums.data?.results ?? [];
  const userList = users.data?.users ?? [];
  const artists = artistsFromAlbums(albumList, query);

  return (
    <View style={tw`flex-1 bg-bg-gray`}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable role="button" onPress={() => void logout()} hitSlop={8}>
              <Text style={tw`another-heading5 text-black px-2`}>Log out</Text>
            </Pressable>
          ),
        }}
      />
      <TextInput
        style={tw`mx-4 mt-3 mb-2 px-5 py-3 rounded-full border border-black bg-bg-gray another-heading4 text-black`}
        placeholder="Search"
        placeholderTextColor="black"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
        value={text}
        onChangeText={setText}
        testID="search"
      />
      <ScrollView contentContainerStyle={tw`px-4 pb-10 gap-8`} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        {!query ? null : albums.isLoading || users.isLoading ? (
          <ActivityIndicator style={tw`mt-10`} />
        ) : albums.isError || users.isError ? (
          <Text style={tw`another-heading2 text-red-500`}>Error fetching search results.</Text>
        ) : !albumList.length && !userList.length ? (
          <Text style={tw`another-heading2`}>No results found for &quot;{query}&quot;</Text>
        ) : (
          <View style={tw.style("gap-8", (albums.isPlaceholderData || users.isPlaceholderData) && "opacity-50")}>
            <Text style={tw`another-heading1 text-[32px] leading-[36px] tracking-[-1px] text-[#767676]`}>
              <Text style={tw`italic`}>Search results for </Text>
              <Text style={tw`underline`}>{query}</Text>
            </Text>
            <Section title="Albums" count={albumList.length} query={query}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-3`}>
                {albumList.map((a) => (
                  <SmallAlbumCard
                    key={a.id}
                    coverImage={a.cover_image || ""}
                    title={a.title}
                    artist={a.artist}
                    year={a.year}
                    onPress={() => router.push(`/album/${a.id}`)}
                  />
                ))}
              </ScrollView>
            </Section>
            <Section title="Artists" count={artists.length} query={query}>
              {artists.map(([name, photo]) => (
                // ponytail: no iOS artist screen yet; wire router.push once one exists.
                <SmallArtistCard key={name} name={name} photo={photo} onPress={() => {}} />
              ))}
            </Section>
            <Section title="Listeners" count={userList.length} query={query}>
              {userList.map((u) => (
                <SmallUserCard key={u.id} username={u.username} avatar={u.avatar || ""} />
              ))}
            </Section>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Section({ title, count, query, children }: { title: string; count: number; query: string; children: ReactNode }) {
  return (
    <View style={tw`gap-3`}>
      <Text style={tw`another-heading1 text-[40px] leading-[44px] tracking-[-1.2px] text-black`}>{title}</Text>
      {count > 0 ? children : <Text style={tw`another-heading5 italic text-gray-400`}>No {title.toLowerCase()} found for &quot;{query}&quot;.</Text>}
    </View>
  );
}

// Mirrors web's getArtistsFromAlbums (apps/web utils/calculations.tsx): the artist search endpoint is not what web renders.
function artistsFromAlbums(albums: SearchResult[], query: string): [string, string][] {
  const photos = new Map<string, string>();
  for (const a of albums) if (a.artist && !photos.get(a.artist)) photos.set(a.artist, a.artist_photo_url || "");
  const exact = (name: string) => (name.toLowerCase() === query.toLowerCase() ? 0 : 1);
  return [...photos].sort(([a], [b]) => exact(a) - exact(b));
}
