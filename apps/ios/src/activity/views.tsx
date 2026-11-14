// The Activity screen's three views of one feed: Feed (cards), Cover Flow (a record carousel) and Grid.
import type { FeedCard } from "@halfnote/data";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { Animated, Easing, FlatList, PanResponder, Pressable, Text, View, type RefreshControlProps } from "react-native";
import { NAVBAR_CLEARANCE } from "../Navbar";
import { Art, Vinyl, font } from "../story/kit";
import { ArrowRight, Byline, F, Heart, INK, Reason, Stamp, SUB, dotWindow, firstName, ago, isFullReview, label, withYear } from "./parts";

interface ListProps {
  cards: FeedCard[];
  me: string | undefined;
  open: (c: FeedCard) => void;
  onEndReached: () => void;
  refreshControl: ReactElement<RefreshControlProps>;
}

const kind = (c: FeedCard) => (isFullReview(c) ? "Full review" : "Short take");

export function FeedList({ cards, me, open, onEndReached, refreshControl }: ListProps) {
  return (
    <FlatList
      data={cards}
      keyExtractor={(c) => String(c.review.id)}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: NAVBAR_CLEARANCE, gap: 12 }}
      onEndReached={onEndReached}
      onEndReachedThreshold={1.5}
      refreshControl={refreshControl}
      renderItem={({ item: c }) => (
        <Pressable
          onPress={() => open(c)}
          accessibilityLabel={`${c.author.name || c.author.username} on ${c.album.title}${c.review.rating ? `, rated ${c.review.rating} out of 10` : ""}`}
          style={({ pressed }) => ({ padding: 16, borderRadius: 18, backgroundColor: "#FFFFFF", gap: 12, transform: [{ scale: pressed ? 0.98 : 1 }] })}
        >
          <Reason card={c} me={me} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Byline card={c} size={34} />
            <Text style={{ fontFamily: F.sans, fontSize: 11, color: "#8A8A8A" }}>{kind(c)}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 84, height: 84 }}>
              <Art uri={c.album.cover_url ?? undefined} style={{ position: "absolute", inset: 0, borderRadius: 4, boxShadow: "0 12px 20px -14px rgba(0,0,0,0.55)" }} />
              <View style={{ position: "absolute", right: -10, top: -10 }}>
                <Stamp rating={c.review.rating} size={40} />
              </View>
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
              <Text style={[font(F.serif, 24, 1), { color: INK }]}>{c.album.title}</Text>
              <Text style={{ fontFamily: F.sans, fontSize: 12, color: SUB }}>{withYear(c)}</Text>
            </View>
          </View>
          <Text numberOfLines={3} style={[font(F.serif, 21, 1.05), { color: INK }]}>
            {c.review.headline}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Heart on={c.review.is_liked} size={14} />
              <Text style={{ fontFamily: F.sans, fontSize: 13, color: "#555" }}>{c.review.likes_count}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ fontFamily: F.sans600, fontSize: 13, color: INK }}>{isFullReview(c) ? "Read" : "Open"}</Text>
              <ArrowRight />
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}

export function GridList({ cards, open, onEndReached, refreshControl }: ListProps) {
  return (
    <FlatList
      data={cards}
      numColumns={2}
      keyExtractor={(c) => String(c.review.id)}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: NAVBAR_CLEARANCE, gap: 22 }}
      columnWrapperStyle={{ gap: 12 }}
      onEndReached={onEndReached}
      onEndReachedThreshold={1.5}
      refreshControl={refreshControl}
      renderItem={({ item: c }) => (
        <Pressable onPress={() => open(c)} style={({ pressed }) => ({ flex: 1 / 2, gap: 8, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
          <View style={{ width: "100%", aspectRatio: 1 }}>
            <Art uri={c.album.cover_url ?? undefined} style={{ position: "absolute", inset: 0, borderRadius: 4, boxShadow: "0 16px 24px -18px rgba(0,0,0,0.6)" }} />
            <View style={{ position: "absolute", right: 8, bottom: 8 }}>
              <Stamp rating={c.review.rating} size={44} />
            </View>
          </View>
          <View style={{ gap: 2 }}>
            <Text numberOfLines={1} style={[font(F.serif, 20, 1), { color: INK }]}>
              {c.album.title}
            </Text>
            <Text numberOfLines={1} style={{ fontFamily: F.sans, fontSize: 12, color: SUB }}>
              {firstName(c.author)} · {ago(c.review.created_at)}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const COVER = 216;
// One card per 112px of drag: the gap between the focused card and its neighbour, so the stage tracks the finger 1:1.
const STEP = 112;
// Per-ms velocity decay for a fling. A fling coasts v·k/(1−k): about 2 cards for a normal flick. Raise toward 0.998
// (iOS scroll views) for longer single flicks. Long runs come from stacking flicks, as on iOS.
const DECEL = 0.995;
const SPRING = { useNativeDriver: true, damping: 22, stiffness: 160 } as const;

/** Cover Flow: the focused record faces you with its vinyl slid out; its neighbours turn away on either side. */
export function CoverFlow({
  cards,
  me,
  index,
  setIndex,
  open,
  like,
}: {
  cards: FeedCard[];
  me: string | undefined;
  index: number;
  setIndex: (i: number) => void;
  open: (c: FeedCard) => void;
  like: (c: FeedCard) => void;
}) {
  const [pos] = useState(() => new Animated.Value(index));
  // The card nearest the live position: it is drawn on top and its details show below, mid-drag included.
  const [near, setNear] = useState(index);
  // The live position, mirrored synchronously. stopAnimation's callback is async on the native driver, so a drag that
  // waited for it would start from a stale position and jump for a frame.
  const live = useRef(index);
  useEffect(() => {
    const id = pos.addListener(({ value }) => {
      live.current = value;
      setNear(Math.round(value));
    });
    return () => pos.removeListener(id);
  }, [pos]);
  // Taps and outside index changes spring here; a swipe animates itself (to keep its velocity) and marks its target.
  const settled = useRef(index);
  useEffect(() => {
    if (index === settled.current) return;
    settled.current = index;
    Animated.spring(pos, { ...SPRING, toValue: index }).start();
  }, [index, pos]);

  const last = cards.length - 1;
  const go = (i: number) => setIndex(Math.max(0, Math.min(last, i)));
  // The responder is created once; it reads the latest values through this ref.
  const latest = useRef({ setIndex, last, settled, live });
  useEffect(() => {
    latest.current = { setIndex, last, settled, live };
  });
  // eslint-disable-next-line react-hooks/refs -- the handlers read `latest` during a gesture, never during render
  const [swipe] = useState(() => {
    let start = 0;
    let at = 0;
    // The coast in flight, so a flick that catches it can add its leftover speed (cards/ms, signed).
    let coast = { t0: 0, ms: 0, v: 0 };
    let carry = 0;
    const end = (vx: number) => {
      const { setIndex, last, settled } = latest.current;
      let v = -vx / STEP; // finger px/ms → cards/ms
      if (carry && Math.sign(carry) === Math.sign(v)) v += carry; // flick again the same way: it speeds up
      carry = 0;
      const target = Math.max(0, Math.min(last, Math.round(at + (v * DECEL) / (1 - DECEL))));
      const dist = target - at;
      settled.current = target;
      setIndex(target);
      if (Math.abs(v) < 0.002 || Math.abs(dist) < 0.5 || Math.sign(dist) !== Math.sign(v)) {
        coast = { t0: 0, ms: 0, v: 0 };
        Animated.spring(pos, { ...SPRING, toValue: target, velocity: v * 1000 }).start();
        return;
      }
      // Ease out cubic starts at 3·dist/ms, so this duration starts the coast at the finger's speed, then slows smoothly
      // onto the card. No spring here: a spring over many cards overshoots and bounces back.
      const ms = Math.max(250, Math.min(1600, (3 * Math.abs(dist)) / Math.abs(v)));
      coast = { t0: Date.now(), ms, v: (3 * dist) / ms };
      Animated.timing(pos, { toValue: target, duration: ms, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    };
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: () => {
        // A touch catches a coast where it is, like a scroll view. Its speed at that moment is the carry.
        const u = coast.ms ? 1 - (Date.now() - coast.t0) / coast.ms : 0;
        carry = u > 0 ? coast.v * u * u : 0;
        start = at = latest.current.live.current;
        pos.stopAnimation();
      },
      onPanResponderMove: (_, g) => {
        const { last } = latest.current;
        const raw = start - g.dx / STEP;
        // Past either end the stage resists: a third of the drag.
        at = raw < 0 ? raw / 3 : raw > last ? last + (raw - last) / 3 : raw;
        pos.setValue(at);
      },
      onPanResponderRelease: (_, g) => end(g.vx),
      onPanResponderTerminate: (_, g) => end(g.vx),
      onPanResponderTerminationRequest: () => false,
    });
  });

  const focus = Math.max(0, Math.min(last, near));
  const c = cards[focus];
  if (!c) return null;
  return (
    <View style={{ flex: 1 }}>
      <View {...swipe.panHandlers} style={{ height: 296, marginTop: 12 }}>
        {cards.map((a, i) =>
          Math.abs(i - focus) > 4 ? null : <FlowCard key={a.review.id} card={a} i={i} pos={pos} away={Math.abs(i - focus)} onPress={() => (i === focus ? open(a) : go(i))} />,
        )}
      </View>

      <View style={{ alignItems: "center", gap: 6, marginTop: 10, paddingHorizontal: 24 }}>
        <Text numberOfLines={1} style={[font(F.serif, 32, 1), { color: INK }]}>
          {c.album.title}
        </Text>
        <Text style={{ fontFamily: F.sans, fontSize: 13, color: "#666" }}>{withYear(c)}</Text>
        <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", gap: 5, height: 4 }}>
          {dotWindow(cards.length, focus).map((dot) => (
            <View key={dot.i} style={{ width: dot.width, height: dot.height, borderRadius: 999, backgroundColor: dot.i === focus ? INK : "#C2C2C2" }} />
          ))}
        </View>
      </View>

      <View style={{ marginTop: 22, paddingHorizontal: 24, gap: 12 }}>
        <Reason card={c} me={me} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Byline card={c} size={36} />
          <Stamp rating={c.review.rating} size={52} />
        </View>
        <Text numberOfLines={4} style={{ fontFamily: F.sans, fontSize: 16, lineHeight: 24, color: "#222" }}>
          {c.review.headline}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 36 }}>
          <Pressable
            onPress={() => like(c)}
            accessibilityRole="button"
            accessibilityState={{ selected: c.review.is_liked }}
            accessibilityLabel="Like"
            hitSlop={8}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, minHeight: 36 }}
          >
            <Heart on={c.review.is_liked} />
            <Text style={{ fontFamily: F.sans, fontSize: 13, color: "#555" }}>{c.review.likes_count}</Text>
          </Pressable>
          <Pressable onPress={() => open(c)} hitSlop={8} style={{ flexDirection: "row", alignItems: "center", gap: 6, minHeight: 36 }}>
            <Text style={{ fontFamily: F.sans600, fontSize: 13, color: INK }}>{isFullReview(c) ? "Read full review" : "Open"}</Text>
            <ArrowRight />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/**
 * One record on the Cover Flow stage. Its own component so the compiler keeps its animated nodes per card (keyed on
 * pos and i) instead of rebuilding them on every focus change mid-fling, which re-attaches the native graph and drops frames.
 */
function FlowCard({ card: a, i, pos, away, onPress }: { card: FeedCard; i: number; pos: Animated.Value; away: number; onPress: () => void }) {
  const d = pos.interpolate({ inputRange: [i - 4, i - 3, i - 2, i - 1, i, i + 1, i + 2, i + 3, i + 4], outputRange: [4, 3, 2, 1, 0, -1, -2, -3, -4], extrapolate: "clamp" });
  // d > 0: the card sits right of focus. Matches the board: ±(112 + (|d|-1)·30) px, turned ∓58°.
  const x = d.interpolate({ inputRange: [-4, -3, -2, -1, 0, 1, 2, 3, 4], outputRange: [-202, -172, -142, -112, 0, 112, 142, 172, 202] });
  const rotateY = d.interpolate({ inputRange: [-1, 0, 1], outputRange: ["58deg", "0deg", "-58deg"], extrapolate: "clamp" });
  const scale = d.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.86, 1.04, 0.86], extrapolate: "clamp" });
  const vinylX = d.interpolate({ inputRange: [-1, 0, 1], outputRange: [9, 54, 9], extrapolate: "clamp" });
  const focused = away === 0;
  return (
    // Two layers on purpose. iOS depth-sorts sibling layers that carry 3D transforms, so a turned neighbour's near
    // edge would poke through the focused card's vinyl whatever the zIndex. The outer layer only slides (2D), so
    // zIndex decides the stacking; the inner layer turns, flattened into its own wrapper.
    <Animated.View
      style={{ position: "absolute", top: 34, left: "50%", marginLeft: -COVER / 2, width: COVER, height: COVER, zIndex: 100 - away, opacity: away > 3 ? 0 : 1, transform: [{ translateX: x }] }}
    >
      <Animated.View style={{ flex: 1, transform: [{ perspective: 900 }, { rotateY }, { scale }] }}>
        <Animated.View style={{ position: "absolute", top: 9, transform: [{ translateX: vinylX }] }}>
          <Vinyl size={198} groove="#151515" land="#2a2a2a" sheen={0} label={label(a)} labelSize={66} shadow="none" />
        </Animated.View>
        <Pressable
          onPress={onPress}
          accessibilityLabel={focused ? `Open ${a.album.title} review` : `Show ${a.album.title} by ${a.album.artist}`}
          style={{ position: "absolute", inset: 0 }}
        >
          <Art uri={a.album.cover_url ?? undefined} style={{ flex: 1, borderRadius: 3, boxShadow: "0 22px 34px -22px rgba(0,0,0,0.55)" }} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
