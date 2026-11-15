import { useFeed } from "@halfnote/data/react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Art, F, font } from "../../story/kit";
import { Avatar, INK, PixelBack, Stamp, SUB, TrackRow, firstName, isFullReview, label, yearOf } from "../../activity/parts";

const PAPER = "#FAFAF8";

const headSize = (n: number) => (n <= 70 ? 58 : n <= 110 ? 48 : 40);

export default function Review() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const card = useFeed().data?.find((c) => String(c.review.id) === id);
  if (!card) return null;
  const { review, album } = card;
  const favorite = review.favorite_song?.position;
  const paras = isFullReview(card) ? review.body.split(/\n\s*\n/).filter((p) => p.trim()) : [];
  const size = headSize(review.headline.length);

  return (
    <View style={{ flex: 1, backgroundColor: PAPER }}>
      <View style={{ paddingTop: insets.top, backgroundColor: PAPER, flexDirection: "row", alignItems: "center", gap: 12, height: 64 + insets.top, paddingLeft: 8, paddingRight: 14 }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Back" style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <PixelBack />
        </Pressable>
        <Text numberOfLines={1} style={{ flex: 1, fontFamily: F.sans600, fontSize: 22, color: INK }}>
          {album.title}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 + insets.bottom }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontFamily: F.sans, fontSize: 15, color: INK }}>{album.artist}</Text>
          <Text style={{ fontFamily: F.sans, fontSize: 15, color: INK }}>{yearOf(card)}</Text>
        </View>

        <View style={{ alignSelf: "flex-end", marginTop: 14, width: 196, height: 196 }}>
          <Pressable onPress={() => router.push(`/album/${album.discogs_id}`)} accessibilityLabel={`Open ${album.title}`} style={{ flex: 1 }}>
            <Art uri={album.cover_url ?? undefined} style={{ flex: 1, borderRadius: 10, boxShadow: "0 18px 30px -20px rgba(0,0,0,0.55)" }} />
          </Pressable>
          <View pointerEvents="none" style={{ position: "absolute", top: -22, left: -32 }}>
            <Stamp rating={review.rating} size={76} />
          </View>
        </View>

        <Text style={[font(F.serif, size, 0.88), { marginTop: 18, color: INK }]}>{review.headline}</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 16 }}>
          <Avatar person={card.author} color={label(card)} size={34} />
          <Text style={{ fontFamily: F.sans, fontSize: 16, color: INK }}>
            by <Text style={{ fontFamily: F.sans600 }}>{firstName(card.author)}</Text>
          </Text>
        </View>

        <Pressable
          onPress={() => router.push({ pathname: "/share", params: { discogsId: album.discogs_id, reviewId: review.id } })}
          style={({ pressed }) => ({ marginTop: 20, minHeight: 52, borderRadius: 10, backgroundColor: INK, alignItems: "center", justifyContent: "center", transform: [{ scale: pressed ? 0.98 : 1 }] })}
        >
          <Text style={{ fontFamily: F.sans500, fontSize: 17, color: PAPER }}>Share</Text>
        </Pressable>

        {paras.length > 0 && (
          <View style={{ gap: 14, marginTop: 22 }}>
            {paras.map((p, i) => (
              <Text key={i} style={{ fontFamily: F.sans, fontSize: 16, lineHeight: 21, color: INK }}>
                {p}
              </Text>
            ))}
          </View>
        )}

        {album.tracklist.length > 0 && (
          <>
            <Text style={{ marginTop: 34, marginBottom: 6, fontFamily: F.sans600, fontSize: 13, color: SUB }}>Tracklist</Text>
            {album.tracklist.map((track, i) => (
              <TrackRow key={`${track.position}-${i}`} position={track.position} title={track.title} length={track.duration ?? ""} on={track.position === favorite} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
