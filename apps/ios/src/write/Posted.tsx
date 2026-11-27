import type { Review } from "@halfnote/data";
import { router } from "expo-router";
import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Rect, SvgXml } from "react-native-svg";
import { INK } from "../components";
import { STAMPS_ON } from "../ratingStamps";
import { isFullReview } from "../reviewDraft";
import { F } from "../story/kit";
import { labelColor } from "../storyDraft";
import { Cover, byline } from "./bits";

export function Posted({ review }: { review: Review }) {
  const insets = useSafeAreaInsets();
  const full = isFullReview(review.body);
  const kind = full ? "Full review" : "Short take";
  const n = review.headline.length;
  const size = n <= 60 ? 38 : n <= 100 ? 32 : 27;
  const date = new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <ScrollView
      style={{ backgroundColor: labelColor(review.album_discogs_id) }}
      contentContainerStyle={[s.posted, { paddingTop: 34 + insets.top, paddingBottom: 28 + insets.bottom }]}
      aria-label="Review posted"
      scrollEnabled={false}
    >
      <View style={s.postedHead}>
        <Text style={s.postedTitle}>Posted</Text>
        <Text style={s.postedNote}>{full ? "Your full review is live in Activity." : "Your take is live in Activity."}</Text>
      </View>

      <View style={s.sleeve} aria-label={`${review.album_title} review`}>
        <Cover uri={review.album_cover ?? undefined} style={s.sleeveCover} />
        {review.rating !== null && (
          <View style={s.badge} aria-label={`Rated ${review.rating} out of 10`}>
            <SvgXml xml={STAMPS_ON[review.rating - 1]} width={82} height={82} />
          </View>
        )}
        <View style={s.sleeveRow}>
          <Text style={s.sleeveTitle} numberOfLines={1}>
            {review.album_title}
          </Text>
          <Text style={s.sleeveMeta}>{byline(review.album_artist, review.album_year)}</Text>
        </View>
        {!!review.headline && <Text style={[s.sleeveHead, { fontSize: size, lineHeight: size }]}>{review.headline}</Text>}
        <View style={s.sleeveFoot}>
          <Text style={s.sleeveBy}>
            by <Text style={s.sleeveUser}>{review.username}</Text> · {kind} · {date}
          </Text>
          <Text style={s.wordmark}>halfnote.</Text>
        </View>
      </View>

      <View style={s.actions}>
        <Pressable
          role="button"
          onPress={() =>
            router.replace({ pathname: "/share", params: { discogsId: review.album_discogs_id, reviewId: review.id } })
          }
          style={s.shareBtn}
        >
          <Svg width={17} height={17} viewBox="0 0 16 16" fill="none" stroke={INK} strokeWidth={1.5}>
            <Rect x={2} y={2} width={12} height={12} rx={3.5} />
            <Circle cx={8} cy={8} r={2.8} />
            <Circle cx={11.6} cy={4.4} r={0.6} fill={INK} />
          </Svg>
          <Text style={s.shareText}>Share to Instagram</Text>
        </Pressable>
        <Pressable role="button" onPress={() => router.dismissTo("/activity")} style={s.feedBtn}>
          <Text style={s.feedText}>Go to activity feed</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  posted: { flexGrow: 1, alignItems: "center", paddingHorizontal: 24 },
  postedHead: { alignItems: "center", gap: 2 },
  postedTitle: { fontFamily: F.serif, fontSize: 46, lineHeight: 48, color: "#F7F7F5" },
  postedNote: { fontFamily: F.sans, fontSize: 13, color: "#F7F7F5" },
  sleeve: {
    marginTop: 26,
    width: 300,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 16,
    borderRadius: 6,
    backgroundColor: "#FAFAF8",
    transform: [{ rotate: "-1.5deg" }],
    boxShadow: "0 40px 60px -30px rgba(0,0,0,0.65)",
  },
  sleeveCover: { width: 272, height: 272, borderRadius: 3 },
  badge: { position: "absolute", top: -24, right: -22, width: 82, height: 82, transform: [{ rotate: "8deg" }] },
  sleeveRow: { marginTop: 12, flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 8 },
  sleeveTitle: { flexShrink: 1, fontFamily: F.sans600, fontSize: 12, color: INK },
  sleeveMeta: { fontFamily: F.sans, fontSize: 12, color: "#6A6A6A" },
  sleeveHead: { marginTop: 10, fontFamily: F.serif, color: INK },
  sleeveFoot: { marginTop: 14, paddingTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sleeveBy: { flexShrink: 1, fontFamily: F.sans, fontSize: 11, color: "#555" },
  sleeveUser: { fontFamily: F.sans600, color: INK },
  wordmark: { fontFamily: F.serifItalic, fontSize: 16, color: INK },
  actions: { marginTop: "auto", paddingTop: 28, width: "100%", gap: 10 },
  shareBtn: { minHeight: 52, borderRadius: 10, backgroundColor: "#FAFAF8", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  shareText: { fontFamily: F.sans600, fontSize: 16, color: INK },
  feedBtn: { minHeight: 52, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  feedText: { fontFamily: F.sans500, fontSize: 16, color: "#F7F7F5" },
});
