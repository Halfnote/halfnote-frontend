import type { FeedCard } from "@halfnote/data";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Art, F } from "../features/story/kit";
import { labelColor } from "../features/story/draft";
import { Avatar } from "./Avatar";
import { ago } from "./format";
import { Heart } from "./icons";
import { ItemRow } from "./ItemRow";
import { INK, SUB } from "./theme";

export const TOP_REVIEW_WIDTH = 300;

interface TopReviewCardProps {
  card: Omit<FeedCard, "latest_activity">;
  onPress: () => void;
  onAlbumPress: () => void;
  onAuthorPress: () => void;
  onLike: () => void;
}

export function TopReviewCard({ card, onPress, onAlbumPress, onAuthorPress, onLike }: TopReviewCardProps) {
  const { review, author, album } = card;
  return (
    <Pressable onPress={onPress} accessibilityLabel={`Open ${author.name || author.username}'s review of ${album.title}`} style={{ width: TOP_REVIEW_WIDTH, padding: 16, borderRadius: 16, backgroundColor: "#FFFFFF", gap: 12 }}>
      <ItemRow
        lead={<Art uri={album.cover_url ?? undefined} style={{ width: 72, height: 72, borderRadius: 2, boxShadow: "0 8px 16px -10px rgba(0,0,0,0.5)" }} />}
        title={album.title}
        subtitle={album.artist}
        rating={review.rating}
        stampSize={52}
        onPress={onAlbumPress}
      />
      {review.headline !== "" && (
        <Text numberOfLines={3} style={{ fontFamily: F.sans, fontSize: 14, lineHeight: 21, color: "#222" }}>
          {review.headline}
        </Text>
      )}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <Pressable onPress={onAuthorPress} accessibilityLabel={`Open ${author.name || author.username}'s profile`} hitSlop={8} style={{ flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1 }}>
          <Avatar person={author} color={labelColor(album.discogs_id)} size={26} />
          <Text numberOfLines={1} style={{ flexShrink: 1, fontFamily: F.sans, fontSize: 12, color: SUB }}>
            <Text style={{ fontFamily: F.sans600, color: INK }}>{author.name || author.username}</Text> · {ago(review.created_at)}
          </Text>
        </Pressable>
        <Pressable
          onPress={onLike}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={review.is_liked ? "Unlike" : "Like"}
          accessibilityState={{ selected: review.is_liked }}
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
        >
          <Heart on={review.is_liked} size={13} />
          <Text style={{ fontFamily: F.sans, fontSize: 12, color: "#555" }}>{review.likes_count}</Text>
        </Pressable>
      </View>
      {review.favorite_song && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Svg width={11} height={12} viewBox="0 0 11 12">
            <Path d="M4 1 L10 0 V8.5 A1.8 1.6 0 1 1 8.6 7 V2.6 L5.4 3.2 V9.6 A1.8 1.6 0 1 1 4 8.1 Z" fill={INK} />
          </Svg>
          <Text numberOfLines={1} style={{ flexShrink: 1, fontFamily: F.sans, fontSize: 12, color: "#555" }}>
            {review.favorite_song.title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
