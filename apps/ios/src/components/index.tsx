import type { FeedCard, Person } from "@halfnote/data";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Image, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect, SvgXml } from "react-native-svg";
import { STAMPS_ON } from "../ratingStamps";
import { Art, F, font } from "../story/kit";
import { labelColor } from "../storyDraft";

export const BG = "#EEEEEE";
export const INK = "#111";
export const SUB = "#6A6A6A";

/** "20m", "4h", "3d", "5w", "2y" */
export function ago(iso: string, now = Date.now()) {
  const s = Math.max(0, (now - Date.parse(iso)) / 1000);
  for (const [unit, size] of [["y", 31536000], ["w", 604800], ["d", 86400], ["h", 3600], ["m", 60]] as const) {
    if (s >= size) return Math.floor(s / size) + unit;
  }
  return "now";
}

/** A photo, or the board's 5×5 mirrored pixel face seeded by the handle on the album's label colour. */
export function Avatar({ person, color, size }: { person: Person; color: string; size: number }) {
  if (person.avatar) return <Image source={{ uri: person.avatar }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  let h = 2166136261;
  for (let k = 0; k < person.username.length; k++) h = Math.imul(h ^ person.username.charCodeAt(k), 16777619) >>> 0;
  const cells = [];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++) if ((h >> (r * 3 + (c < 3 ? c : 4 - c))) & 1) cells.push(<Rect key={r * 5 + c} x={c * 4} y={r * 4} width={4} height={4} fill={BG} />);
  const face = Math.round(size * 0.58);
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
      <Svg width={face} height={face} viewBox="0 0 20 20">
        {cells}
      </Svg>
    </View>
  );
}

export function Stamp({ rating, size }: { rating: number | null; size: number }) {
  if (rating == null) return null;
  return <SvgXml xml={STAMPS_ON[rating - 1]} width={size} height={size} />;
}

const HEART = "M6.5 11 C2 7.6 0.8 5.8 0.8 3.8 A2.8 2.8 0 0 1 6.5 2.6 A2.8 2.8 0 0 1 12.2 3.8 C12.2 5.8 11 7.6 6.5 11 Z";

export const Heart = ({ on, size = 15 }: { on?: boolean; size?: number }) => (
  <Svg width={size + 1} height={size} viewBox="0 0 13 12">
    <Path d={HEART} fill={on ? INK : "none"} stroke={on ? INK : "#555"} strokeWidth={1.2} />
  </Svg>
);

export const PixelBack = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    {[[3, 11, 19], [5, 9], [5, 13], [7, 7], [7, 15], [9, 5], [9, 17]].map(([x, y, w = 2]) => (
      <Rect key={`${x},${y}`} x={x} y={y} width={w} height={2} fill={INK} />
    ))}
  </Svg>
);

/**
 * Position dots, at most nine, centred on the focused card. When more cards sit past
 * either end, the two outermost dots shrink to say so.
 */
export function dotWindow(count: number, focused: number) {
  const max = 9;
  const start = Math.max(0, Math.min(focused - Math.floor(max / 2), count - max));
  const end = Math.min(count, start + max);
  const dots = [];
  for (let i = start; i < end; i++) {
    const fromEdge = Math.min(start > 0 ? i - start : Infinity, end < count ? end - 1 - i : Infinity);
    const size = fromEdge === 0 ? 2 : fromEdge === 1 ? 3 : 4;
    dots.push({ i, width: i === focused ? 18 : size, height: size === 4 || i === focused ? 4 : size });
  }
  return dots;
}

/** A tracklist row as the board draws it; the favourite is inverted. */
export function TrackRow({ position, title, length, on }: { position: string; title: string; length: string; on: boolean }) {
  const color = on ? BG : INK;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", minHeight: 40, paddingHorizontal: 10, borderRadius: 8, backgroundColor: on ? "#1d1d1d" : "transparent" }}>
      <Text style={{ width: 28, fontFamily: F.sans, fontSize: 12, color, opacity: 0.6 }}>{position}</Text>
      <Text style={{ flex: 1, fontFamily: F.sans, fontSize: 15, color }}>{title}</Text>
      <Text style={{ width: 44, textAlign: "right", fontFamily: F.sans, fontSize: 12, color, opacity: 0.6 }}>{length}</Text>
    </View>
  );
}

export function PageHeader({ title, background = BG }: { title: string; background?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: background, flexDirection: "row", alignItems: "center", gap: 12, height: 64 + insets.top, paddingLeft: 8, paddingRight: 14 }}>
      <Pressable onPress={() => router.back()} accessibilityLabel="Back" style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
        <PixelBack />
      </Pressable>
      <Text numberOfLines={1} style={{ flex: 1, fontFamily: F.sans600, fontSize: 22, color: INK }}>
        {title}
      </Text>
    </View>
  );
}

export function SectionHeader({ title, kicker, style }: { title: string; kicker?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }, style]}>
      <Text style={[font(F.serif, 28, 1), { color: INK }]}>{title}</Text>
      {kicker ? <Text style={{ fontFamily: F.sans, fontSize: 12, color: "#666" }}>{kicker}</Text> : null}
    </View>
  );
}

interface ItemRowProps {
  lead: ReactNode;
  title: string;
  subtitle: string;
  rating: number | null;
  stampSize?: number;
  /** A person's row: small sans name instead of the serif album title. */
  person?: boolean;
  onPress?: () => void;
}

export function ItemRow({ lead, title, subtitle, rating, stampSize = 40, person, onPress }: ItemRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={`${title}, ${subtitle}${rating ? `, rated ${rating} out of 10` : ""}`}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: person ? 10 : 12, transform: [{ scale: pressed ? 0.98 : 1 }] })}
    >
      {lead}
      <View style={{ flex: 1, minWidth: 0, gap: person ? 1 : 3 }}>
        <Text numberOfLines={2} style={person ? { fontFamily: F.sans600, fontSize: 14, color: INK } : [font(F.serif, 21, 1), { color: INK }]}>
          {title}
        </Text>
        <Text numberOfLines={1} style={{ fontFamily: F.sans, fontSize: 12, color: SUB }}>
          {subtitle}
        </Text>
      </View>
      <Stamp rating={rating} size={stampSize} />
    </Pressable>
  );
}

export function ReviewRow({ text, onPress, ...row }: Omit<ItemRowProps, "onPress" | "stampSize"> & { text: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({ padding: 14, borderRadius: 14, backgroundColor: "#FFFFFF", gap: 10, transform: [{ scale: pressed ? 0.98 : 1 }] })}
    >
      <ItemRow {...row} />
      {text !== "" && <Text style={[font(F.serif, 20, 1.15), { color: INK }]}>{text}</Text>}
    </Pressable>
  );
}

export const TOP_REVIEW_WIDTH = 306;

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
