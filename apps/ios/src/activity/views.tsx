import type { FeedCard } from "@halfnote/data";
import { useEffect, useRef, useState, type ReactElement } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type RefreshControlProps,
} from "react-native";
import { NAVBAR_CLEARANCE } from "../Navbar";
import { Art, F, Vinyl, font } from "../story/kit";
import { ArrowRight, Byline, Heart, INK, Reason, Stamp, SUB, displayName, dotWindow, firstName, ago, isFullReview, label, withYear } from "./parts";

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
          accessibilityLabel={`${displayName(c.author)} on ${c.album.title}${c.review.rating ? `, rated ${c.review.rating} out of 10` : ""}`}
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
const STEP = 112;

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
  const { width } = useWindowDimensions();
  const [scrollX] = useState(() => new Animated.Value(index * STEP));
  const [pos] = useState(() => Animated.divide(scrollX, STEP));
  const [near, setNear] = useState(index);
  const scroller = useRef<ScrollView>(null);
  const last = cards.length - 1;
  const focus = Math.max(0, Math.min(last, near));
  useEffect(() => {
    if (focus !== index) setIndex(focus);
  }, [focus, index, setIndex]);
  const go = (i: number) => scroller.current?.scrollTo({ x: i * STEP, animated: true });

  const c = cards[focus];
  if (!c) return null;
  return (
    <View style={{ flex: 1 }}>
      {/* iOS's own scroll view does the finger tracking, momentum, snapping and edge bounce; the cards just read its offset. */}
      <Animated.ScrollView
        ref={scroller}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={STEP}
        decelerationRate={0.995}
        contentOffset={{ x: index * STEP, y: 0 }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
          listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => setNear(Math.round(e.nativeEvent.contentOffset.x / STEP)),
        })}
        style={{ height: 296, marginTop: 12, flexGrow: 0 }}
        contentContainerStyle={{ width: width + last * STEP }}
      >
        {cards.map((a, i) =>
          Math.abs(i - focus) > 4 ? null : (
            <FlowCard key={a.review.id} card={a} i={i} left={width / 2 + i * STEP} pos={pos} away={Math.abs(i - focus)} onPress={() => (i === focus ? open(a) : go(i))} />
          ),
        )}
      </Animated.ScrollView>

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

// Its own component so the compiler keeps each card's animated nodes across focus changes; rebuilding them drops frames.
function FlowCard({ card: a, i, left, pos, away, onPress }: { card: FeedCard; i: number; left: number; pos: Animated.AnimatedInterpolation<number>; away: number; onPress: () => void }) {
  const d = pos.interpolate({ inputRange: [i - 4, i - 3, i - 2, i - 1, i, i + 1, i + 2, i + 3, i + 4], outputRange: [4, 3, 2, 1, 0, -1, -2, -3, -4], extrapolate: "clamp" });
  // Each card scrolls in a STEP-wide slot; this pulls it from its slot to the board's spacing, ±(112 + (|d|-1)·30).
  const x = d.interpolate({ inputRange: [-4, -3, -2, -1, 0, 1, 2, 3, 4], outputRange: [246, 164, 82, 0, 0, 0, -82, -164, -246] });
  const rotateY = d.interpolate({ inputRange: [-1, 0, 1], outputRange: ["58deg", "0deg", "-58deg"], extrapolate: "clamp" });
  const scale = d.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.86, 1.04, 0.86], extrapolate: "clamp" });
  const vinylX = d.interpolate({ inputRange: [-1, 0, 1], outputRange: [9, 54, 9], extrapolate: "clamp" });
  const focused = away === 0;
  return (
    // iOS depth-sorts sibling layers with 3D transforms, ignoring zIndex. Siblings only slide; the turn is one layer in.
    <Animated.View
      style={{ position: "absolute", top: 34, left, marginLeft: -COVER / 2, width: COVER, height: COVER, zIndex: 100 - away, opacity: away > 3 ? 0 : 1, transform: [{ translateX: x }] }}
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
