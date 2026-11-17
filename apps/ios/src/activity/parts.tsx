// Activity-only pieces its three views and its review sheet share, drawn from the
// design board `Activity.dc.html` (Liner Notes).
import type { FeedCard, Person } from "@halfnote/data";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Avatar, INK, SUB, ago } from "../components";
import { F } from "../story/kit";
import { labelColor } from "../storyDraft";

export const firstName = (p: Person) => (p.name || p.username).split(" ")[0];
export const displayName = (p: Person) => p.name || p.username;
type Card = Pick<FeedCard, "review" | "album">;
export const isFullReview = (c: Card) => c.review.body !== "";
export const label = (c: Card) => labelColor(c.album.discogs_id);
export const yearOf = (c: Card) => (c.album.year == null ? "" : String(c.album.year));
export const withYear = (c: FeedCard) => [c.album.artist, yearOf(c)].filter(Boolean).join(" · ");

/** "Nia liked this · 2m", or null for a plain new review (the contract shows no reason line then). */
export function reasonLine(c: FeedCard, me: string | undefined) {
  const a = c.latest_activity;
  if (a.type === "review_created") return null;
  const who = a.actor.username === me ? "You" : firstName(a.actor);
  return `${who} ${a.type === "review_liked" ? "liked this" : "commented"} · ${ago(a.created_at)}`;
}

export const ArrowRight = () => (
  <Svg width={10} height={10} viewBox="0 0 10 10">
    <Path d="M2 5 H8 M5.5 2.5 L8 5 L5.5 7.5" fill="none" stroke={INK} strokeWidth={1.4} />
  </Svg>
);

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
  return (
    <Text numberOfLines={1} accessibilityElementsHidden={!line} style={{ fontFamily: F.sans500, fontSize: 12, color: SUB }}>
      {line ?? " "}
    </Text>
  );
}

/**
 * An Animated.Value with a synchronous mirror (`live`) and the nearest whole step (`near`).
 * stopAnimation's callback is async on the native driver; a drag waiting on it starts stale and jumps a frame.
 */
export function useLiveValue(initial: number) {
  const [x] = useState(() => new Animated.Value(initial));
  const [near, setNear] = useState(initial);
  const live = useRef(initial);
  useEffect(() => {
    const id = x.addListener(({ value }) => {
      live.current = value;
      setNear(Math.round(value));
    });
    return () => x.removeListener(id);
  }, [x]);
  return { x, live, near };
}
