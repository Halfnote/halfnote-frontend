import { useAlbumDetails } from "@halfnote/data/react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Art, F, font } from "../../story/kit";
import { labelColor } from "../../storyDraft";
import { Avatar, BG, INK, PageHeader, ReviewRow, SectionHeader, Stamp, SUB, TrackRow } from "../../components";

const minutes = (sec: number | null) => (sec == null ? "" : `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`);

export default function Album() {
  const insets = useSafeAreaInsets();
  const { discogsId } = useLocalSearchParams<{ discogsId: string }>();
  const { data, error } = useAlbumDetails(discogsId);
  const songs = data?.album.songs ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <PageHeader title="Album" />
      {error && <Text style={{ fontFamily: F.sans, fontSize: 14, color: SUB, textAlign: "center", marginTop: 48 }}>{error.message}</Text>}
      {data && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 48 + insets.bottom }}>
          <View style={{ alignItems: "center", gap: 12 }}>
            <Art uri={data.album.cover_url} style={{ width: 248, height: 248, borderRadius: 4, boxShadow: "0 30px 44px -26px rgba(0,0,0,0.6)" }} />
            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={[font(F.serif, 38, 1), { color: INK, textAlign: "center" }]}>{data.album.title}</Text>
              <Text style={{ fontFamily: F.sans, fontSize: 14, color: "#444", textAlign: "center" }}>
                {data.album.year ? `${data.album.artist} · ${data.album.year}` : data.album.artist}
              </Text>
              {!!data.album.label && <Text style={{ fontFamily: F.sans, fontSize: 12, color: SUB, textAlign: "center" }}>{data.album.label}</Text>}
            </View>
            {data.average_rating != null && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Stamp rating={Math.round(data.average_rating)} size={56} />
                <Text style={{ fontFamily: F.sans, fontSize: 13, color: "#555" }}>
                  Average from{"\n"}
                  {data.rating_count} ratings
                </Text>
              </View>
            )}
          </View>

          <Pressable
            role="button"
            onPress={() => router.push({ pathname: "/write", params: { discogsId } })}
            style={({ pressed }) => ({
              marginTop: 20,
              minHeight: 50,
              borderRadius: 12,
              backgroundColor: "#1d1d1d",
              alignItems: "center",
              justifyContent: "center",
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <Text style={{ fontFamily: F.sans600, fontSize: 16, color: BG }}>Write a review</Text>
          </Pressable>

          {data.reviews.length > 0 && (
            <>
              <SectionHeader title="Reviews" style={{ marginTop: 32, marginBottom: 10 }} />
              <View style={{ gap: 10 }}>
                {data.reviews.map((r) => (
                  <ReviewRow
                    key={r.id}
                    person
                    lead={
                      <Pressable onPress={() => router.push(`/user/${r.username}`)} accessibilityLabel={`Open ${r.username}'s profile`} hitSlop={8}>
                        <Avatar person={{ username: r.username, name: "", avatar: r.user_avatar }} color={labelColor(discogsId)} size={34} />
                      </Pressable>
                    }
                    title={r.username}
                    subtitle={r.is_following_author ? `You follow · @${r.username}` : `@${r.username}`}
                    rating={r.rating}
                    text={r.headline}
                  />
                ))}
              </View>
            </>
          )}

          {songs.length > 0 && (
            <>
              <SectionHeader title="Tracklist" style={{ marginTop: 32, marginBottom: 6 }} />
              {songs.map((song) => (
                <TrackRow key={song.id} position={song.position} title={song.title} length={minutes(song.duration_seconds)} on={false} />
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
