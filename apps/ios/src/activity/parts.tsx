// Pieces the Activity screen's three views and its review sheet share, drawn from the
// design board `Activity.dc.html` (Liner Notes).
import type { FeedCard, Person } from "@halfnote/data";
import { Image, Text, View } from "react-native";
import Svg, { Path, Rect, SvgXml } from "react-native-svg";
import { STAMPS_ON } from "../ratingStamps";
import { F } from "../story/kit";
import { labelColor } from "../storyDraft";

export { F };
export const BG = "#EEEEEE";
export const INK = "#111";
export const SUB = "#6A6A6A";

export const firstName = (p: Person) => (p.name || p.username).split(" ")[0];
export const displayName = (p: Person) => p.name || p.username;
export const isFullReview = (c: FeedCard) => c.review.body !== "";
export const label = (c: FeedCard) => labelColor(c.album.discogs_id);
export const yearOf = (c: FeedCard) => (c.album.year == null ? "" : String(c.album.year));
export const withYear = (c: FeedCard) => [c.album.artist, yearOf(c)].filter(Boolean).join(" · ");

/** "20m", "4h", "3d", "5w", "2y" */
export function ago(iso: string, now = Date.now()) {
  const s = Math.max(0, (now - Date.parse(iso)) / 1000);
  for (const [unit, size] of [["y", 31536000], ["w", 604800], ["d", 86400], ["h", 3600], ["m", 60]] as const) {
    if (s >= size) return Math.floor(s / size) + unit;
  }
  return "now";
}

/** "Nia liked this · 2m", or null for a plain new review (the contract shows no reason line then). */
export function reasonLine(c: FeedCard, me: string | undefined) {
  const a = c.latest_activity;
  if (a.type === "review_created") return null;
  const who = a.actor.username === me ? "You" : firstName(a.actor);
  return `${who} ${a.type === "review_liked" ? "liked this" : "commented"} · ${ago(a.created_at)}`;
}

/** A photo, or the board's 5×5 mirrored pixel face seeded by the handle on the album's label colour. */
export function Avatar({ person, color, size }: { person: Person; color: string; size: number }) {
  if (person.avatar) return <Image source={{ uri: person.avatar }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  let h = 2166136261;
  for (let k = 0; k < person.username.length; k++) h = Math.imul(h ^ person.username.charCodeAt(k), 16777619) >>> 0;
  const cells = [];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++) if ((h >> (r * 3 + (c < 3 ? c : 4 - c))) & 1) cells.push(<Rect key={r * 5 + c} x={c * 4} y={r * 4} width={4} height={4} fill={BG} />);
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
      <Svg width={20} height={20}>{cells}</Svg>
    </View>
  );
}

/** The rating stamp; a review without a rating shows none. */
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

export const ArrowRight = () => (
  <Svg width={10} height={10} viewBox="0 0 10 10">
    <Path d="M2 5 H8 M5.5 2.5 L8 5 L5.5 7.5" fill="none" stroke={INK} strokeWidth={1.4} />
  </Svg>
);

export const PixelBack = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    {[[3, 11, 19], [5, 9], [5, 13], [7, 7], [7, 15], [9, 5], [9, 17]].map(([x, y, w = 2]) => (
      <Rect key={`${x},${y}`} x={x} y={y} width={w} height={2} fill={INK} />
    ))}
  </Svg>
);

/** Author row: avatar, name, "@handle · 2h". */
export function Byline({ card, size }: { card: FeedCard; size: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
      <Avatar person={card.author} color={label(card)} size={size} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontFamily: F.sans600, fontSize: 14, color: INK }}>
          {displayName(card.author)}
        </Text>
        <Text numberOfLines={1} style={{ fontFamily: F.sans, fontSize: 12, color: SUB }}>
          @{card.author.username} · {ago(card.review.created_at)}
        </Text>
      </View>
    </View>
  );
}

export function Reason({ card, me }: { card: FeedCard; me: string | undefined }) {
  const line = reasonLine(card, me);
  if (!line) return null;
  return <Text style={{ fontFamily: F.sans500, fontSize: 12, color: SUB }}>{line}</Text>;
}

/**
 * Cover Flow's position dots, at most nine, centred on the focused card. When more cards sit past
 * either end, the two outermost dots shrink to say so.
 */
export function dotWindow(count: number, focused: number, max = 9) {
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
