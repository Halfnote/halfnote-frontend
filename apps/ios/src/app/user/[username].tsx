import { useUserProfile, useUserReviews } from "@halfnote/data/react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Art, F, font } from "../../features/story/kit";
import { labelColor } from "../../features/story/draft";
import { AlbumBanner, Avatar, BG, INK, PageHeader, ReviewRow, SectionHeader, SUB } from "../../components";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { username } = useLocalSearchParams<{ username: string }>();
  const profile = useUserProfile(username);
  const reviews = useUserReviews(username).data ?? [];
  const user = profile.data;

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <PageHeader title={`@${username}`} />
      {profile.isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : !user ? (
        <Text style={{ margin: 20, fontFamily: F.sans, fontSize: 15, color: SUB }}>{profile.error?.message ?? "User not found"}</Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 48 + insets.bottom }}>
          <AlbumBanner covers={user.favorite_albums.map((a) => a.cover_url)} />
          <View style={{ marginTop: -34, paddingHorizontal: 20, alignItems: "flex-start", gap: 10 }}>
            <View style={{ padding: 4, borderRadius: 44, backgroundColor: BG }}>
              <Avatar person={{ username: user.username, name: user.display_name, avatar: user.avatar ?? null, avatar_preset: user.avatar_preset }} color={labelColor(user.username)} size={80} />
            </View>
            <View style={{ gap: 4 }}>
              <Text style={[font(F.serif, 34, 1), { color: INK }]}>{user.display_name || user.username}</Text>
              <Text style={{ fontFamily: F.sans, fontSize: 13, color: SUB }}>
                @{user.username} · {user.follower_count} {user.follower_count === 1 ? "follower" : "followers"}
              </Text>
              {user.bio ? <Text style={{ marginTop: 4, fontFamily: F.sans, fontSize: 15, lineHeight: 21, color: "#222" }}>{user.bio}</Text> : null}
            </View>
            <View style={{ marginTop: 4, minWidth: 120, minHeight: 40, paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#1d1d1d", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: F.sans600, fontSize: 14, color: BG }}>Follow</Text>
            </View>
          </View>
          <SectionHeader title="Reviews" style={{ marginTop: 30, marginBottom: 10, marginHorizontal: 20 }} />
          <View style={{ paddingHorizontal: 20, gap: 10 }}>
            {reviews.map((r) => (
              <ReviewRow
                key={r.id}
                lead={<Art uri={r.album_cover ?? undefined} style={{ width: 56, height: 56, borderRadius: 2 }} />}
                title={r.album_title}
                subtitle={r.album_artist}
                rating={r.rating}
                text={r.headline}
                onPress={() => router.push(`/review/${r.id}`)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
