import { useAlbumDetails, useToggleReview } from "@halfnote/data/react";
import type { Review } from "@halfnote/data";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { AlbumCard, RatingBadge } from "@halfnote/ui";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSession } from "../../session";

export default function AlbumDetails() {
  const { discogsId } = useLocalSearchParams<{ discogsId: string }>();
  const username = useSession()?.username ?? "";
  const { data, error, isLoading } = useAlbumDetails(discogsId);
  const { toggleLikeMutation } = useToggleReview(username, discogsId);

  if (isLoading) return <ActivityIndicator style={styles.center} />;
  if (error || !data) return <Text style={[styles.center, styles.error]}>{error?.message ?? "Album not found"}</Text>;

  const { album, reviews, average_rating, review_count } = data;
  const rating = average_rating != null ? Math.round(average_rating) : undefined;
  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={reviews}
      keyExtractor={(r) => String(r.id)}
      ListHeaderComponent={
        <View style={styles.header}>
          <Stack.Screen options={{ title: album.title }} />
          <AlbumCard albumCover={album.cover_url ?? ""} albumName={album.title} artistName={album.artist} size={240} />
          <Text style={styles.muted}>
            {album.year ? `${album.year} · ` : ""}
            {review_count} reviews
          </Text>
          {rating != null && <RatingBadge rating={rating} />}
          <ShareButton onPress={() => router.push({ pathname: "/share", params: { discogsId } })} />
        </View>
      }
      renderItem={({ item }) => (
        <ReviewRow
          review={item}
          onLike={() => toggleLikeMutation.mutate(item.id)}
          onShare={() => router.push({ pathname: "/share", params: { discogsId, reviewId: item.id } })}
        />
      )}
      ListEmptyComponent={<Text style={styles.muted}>No reviews yet</Text>}
    />
  );
}

function ReviewRow({ review, onLike, onShare }: { review: Review; onLike: () => void; onShare: () => void }) {
  return (
    <View style={styles.review}>
      <View style={styles.reviewHeader}>
        <RatingBadge rating={review.rating} />
        <Text style={styles.reviewer}>{review.username}</Text>
      </View>
      {!!review.content && <Text>{review.content}</Text>}
      <Pressable onPress={onLike} hitSlop={8} accessibilityRole="button" testID={`like-${review.id}`}>
        <Text style={review.is_liked_by_user ? styles.liked : styles.muted}>
          {review.is_liked_by_user ? "♥" : "♡"} {review.likes_count}
        </Text>
      </Pressable>
      <ShareButton onPress={onShare} />
    </View>
  );
}

function ShareButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" accessibilityLabel="Share to Story">
      <Text style={styles.muted}>Share to Story</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#fff" },
  content: { padding: 16, gap: 12 },
  center: { flex: 1, textAlign: "center", marginTop: 48 },
  error: { color: "#c00" },
  header: { alignItems: "center", gap: 4, marginBottom: 12 },
  muted: { color: "#666" },
  review: { borderTopWidth: StyleSheet.hairlineWidth, borderColor: "#ccc", paddingTop: 12, gap: 6 },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  reviewer: { fontWeight: "600" },
  liked: { color: "#d22" },
});
