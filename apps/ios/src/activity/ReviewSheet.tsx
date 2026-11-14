// The review page that grows out of a card: album, stamp, headline, author, Share, body and tracklist.
import type { FeedCard } from "@halfnote/data";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Easing, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Art, font } from "../story/kit";
import { Avatar, F, INK, PixelBack, Stamp, firstName, isFullReview, label, yearOf } from "./parts";

const PAPER = "#FAFAF8";

/** Board sizing: short headlines set large, long ones smaller. */
const headSize = (n: number) => (n <= 70 ? 58 : n <= 110 ? 48 : 40);

export function ReviewSheet({ card, onClose }: { card: FeedCard | undefined; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (card) Animated.timing(t, { toValue: 1, duration: 280, easing: Easing.bezier(0.2, 0.8, 0.2, 1), useNativeDriver: true }).start();
  }, [card, t]);

  const close = (then?: () => void) =>
    Animated.timing(t, { toValue: 0, duration: 220, easing: Easing.bezier(0.4, 0, 1, 1), useNativeDriver: true }).start(() => {
      onClose();
      then?.();
    });

  if (!card) return null;
  const { review, album } = card;
  const favorite = review.favorite_song?.position;
  const paras = isFullReview(card) ? review.body.split(/\n\s*\n/).filter((p) => p.trim()) : [];
  const size = headSize(review.headline.length);

  return (
    <Modal transparent visible onRequestClose={() => close()} animationType="none">
      <Animated.View style={{ flex: 1, backgroundColor: PAPER, opacity: t, transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }}>
        <View style={{ paddingTop: insets.top, backgroundColor: PAPER, flexDirection: "row", alignItems: "center", gap: 12, height: 64 + insets.top, paddingLeft: 8, paddingRight: 14 }}>
          <Pressable onPress={() => close()} accessibilityLabel="Back" style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
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
            <Pressable onPress={() => close(() => router.push(`/album/${album.discogs_id}`))} accessibilityLabel={`Open ${album.title}`} style={{ flex: 1 }}>
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
            onPress={() => close(() => router.push({ pathname: "/share", params: { discogsId: album.discogs_id, reviewId: review.id } }))}
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
              <Text style={{ marginTop: 34, marginBottom: 6, fontFamily: F.sans600, fontSize: 13, color: "#6A6A6A" }}>Tracklist</Text>
              {album.tracklist.map((track, i) => {
                const fav = track.position === favorite;
                const color = fav ? "#EEEEEE" : INK;
                return (
                  <View
                    key={`${track.position}-${i}`}
                    style={{ flexDirection: "row", alignItems: "center", minHeight: 40, paddingHorizontal: 10, borderRadius: 8, backgroundColor: fav ? "#1d1d1d" : "transparent" }}
                  >
                    <Text style={{ width: 28, fontFamily: F.sans, fontSize: 12, color, opacity: 0.6 }}>{track.position}</Text>
                    <Text style={{ flex: 1, fontFamily: F.sans, fontSize: 15, color }}>{track.title}</Text>
                    <Text style={{ width: 44, textAlign: "right", fontFamily: F.sans, fontSize: 12, color, opacity: 0.6 }}>{track.duration ?? ""}</Text>
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
