import type { FeedCard } from "@halfnote/data";
import { useFeed, useLikeFailed, useSetLike } from "@halfnote/data/react";
import * as SecureStore from "expo-secure-store";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, PanResponder, Pressable, RefreshControl, Text, View } from "react-native";
import { BG, INK, useLiveValue } from "../../activity/parts";
import { CoverFlow, FeedList, GridList } from "../../activity/views";
import { NAVBAR_CLEARANCE } from "../../Navbar";
import { useSession } from "../../session";
import { F } from "../../story/kit";

type View_ = "feed" | "flow" | "grid";
const VIEWS: [View_, string][] = [
  ["feed", "Feed"],
  ["flow", "Cover Flow"],
  ["grid", "Grid"],
];
const VIEW_KEY = "halfnote.activityView";
// Placeholder until the copy is decided.
const EMPTY_MESSAGE = "Empty message what should this say";

export default function Activity() {
  const me = useSession()?.username;
  const feed = useFeed();
  const cards = feed.data ?? [];
  const setLike = useSetLike();

  const [view, setView] = useState<View_>("flow");
  useEffect(() => {
    void SecureStore.getItemAsync(VIEW_KEY).then((v) => {
      if (v === "feed" || v === "flow" || v === "grid") setView(v);
    });
  }, []);
  const pick = (v: View_) => {
    setView(v);
    void SecureStore.setItemAsync(VIEW_KEY, v);
  };

  const [index, setIndex] = useState(0);
  const open = (c: FeedCard) => router.push(`/review/${c.review.id}`);
  const like = (c: FeedCard) => setLike(c.review.id, !c.review.is_liked);

  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useLikeFailed(
    useCallback(() => {
      clearTimeout(toastTimer.current);
      setToast("Couldn't save your like");
      toastTimer.current = setTimeout(() => setToast(""), 1800);
    }, []),
  );

  const { hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = feed;
  const more = () => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };
  // Cover Flow pages by position: fetch more once the focused card is within five of the end.
  useEffect(() => {
    if (view === "flow" && index >= cards.length - 5) more();
  });

  const [refreshing, setRefreshing] = useState(false);
  const pull = () => {
    setRefreshing(true);
    void refetch().finally(() => setRefreshing(false));
  };
  // Cover Flow has no pull gesture (it would fight the swipe), so it refreshes on coming back to the tab.
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  });
  const seen = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (seen.current && viewRef.current === "flow") void refetch();
      seen.current = true;
    }, [refetch]),
  );

  const clampedIndex = Math.min(index, Math.max(0, cards.length - 1));
  const refreshControl = <RefreshControl refreshing={refreshing} onRefresh={pull} />;

  let body;
  if (feed.isPending) body = <ActivityIndicator style={{ flex: 1 }} />;
  else if (feed.isError && cards.length === 0)
    body = (
      <Centered>
        <Text style={{ fontFamily: F.sans, fontSize: 15, color: INK }}>{"Couldn't load your feed."}</Text>
        <Pill onPress={() => void refetch()}>Retry</Pill>
      </Centered>
    );
  else if (cards.length === 0)
    body = (
      <Centered>
        <Text style={{ fontFamily: F.sans, fontSize: 15, color: INK, textAlign: "center" }}>{EMPTY_MESSAGE}</Text>
        <Pill onPress={() => router.navigate("/")}>Go to Discover</Pill>
      </Centered>
    );
  else if (view === "flow") body = <CoverFlow cards={cards} me={me} index={clampedIndex} setIndex={setIndex} open={open} like={like} />;
  else {
    const List = view === "feed" ? FeedList : GridList;
    body = <List cards={cards} me={me} open={open} onEndReached={more} refreshControl={refreshControl} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <Switcher view={view} pick={pick} />
      {body}
      {toast ? (
        <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: NAVBAR_CLEARANCE, alignItems: "center" }}>
          <Text style={{ fontFamily: F.sans500, fontSize: 13, color: BG, backgroundColor: INK, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, overflow: "hidden" }}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}

const KNOB = 78;
const SLOT = KNOB + 2;
const LAST = VIEWS.length - 1;
const settle = (x: Animated.Value, to: number) => Animated.spring(x, { toValue: to, useNativeDriver: true, damping: 20, stiffness: 220 }).start();

function Switcher({ view, pick }: { view: View_; pick: (v: View_) => void }) {
  const at = VIEWS.findIndex(([k]) => k === view);
  const { x, live, near } = useLiveValue(at);
  useEffect(() => settle(x, at), [at, x]);

  const latest = useRef({ pick, at });
  useEffect(() => {
    latest.current = { pick, at };
  });
  // eslint-disable-next-line react-hooks/refs -- the handlers read `latest` during a gesture, never during render
  const [drag] = useState(() => {
    let start = 0;
    const end = () => {
      const { pick, at } = latest.current;
      const to = Math.round(live.current);
      if (to === at) settle(x, to);
      else pick(VIEWS[to][0]);
    };
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 4 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: () => {
        start = live.current;
        x.stopAnimation();
      },
      onPanResponderMove: (_, g) => x.setValue(Math.max(0, Math.min(LAST, start + g.dx / SLOT))),
      onPanResponderRelease: end,
      onPanResponderTerminate: end,
      onPanResponderTerminationRequest: () => false,
    });
  });

  return (
    <View style={{ height: 52, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
      <View {...drag.panHandlers} style={{ flexDirection: "row", padding: 3, gap: 2, borderRadius: 999, backgroundColor: BG }}>
        <Animated.View
          style={{ position: "absolute", left: 3, top: 3, bottom: 3, width: KNOB, borderRadius: 999, backgroundColor: "#1d1d1d", transform: [{ translateX: x.interpolate({ inputRange: [0, LAST], outputRange: [0, SLOT * LAST] }) }] }}
        />
        {VIEWS.map(([k, name], i) => (
          <Pressable key={k} onPress={() => pick(k)} accessibilityRole="button" accessibilityState={{ selected: k === view }} style={{ width: KNOB, minHeight: 30, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: F.sans500, fontSize: 12, color: i === near ? BG : INK }}>{name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const Centered = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16, paddingHorizontal: 32, paddingBottom: NAVBAR_CLEARANCE }}>{children}</View>
);

const Pill = ({ onPress, children }: { onPress: () => void; children: string }) => (
  <Pressable onPress={onPress} style={({ pressed }) => ({ paddingHorizontal: 18, minHeight: 40, borderRadius: 999, backgroundColor: INK, justifyContent: "center", transform: [{ scale: pressed ? 0.97 : 1 }] })}>
    <Text style={{ fontFamily: F.sans500, fontSize: 14, color: BG }}>{children}</Text>
  </Pressable>
);
