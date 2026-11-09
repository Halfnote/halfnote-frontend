import type { Review, SearchResult } from "@halfnote/data";
import { useCreateReview, useDebounce, useRecentlyViewed, useRecordView, useSearchAlbums } from "@halfnote/data/react";
import { router } from "expo-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Image,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useAnimatedValue,
  View,
  type NativeSyntheticEvent,
  type TextLayoutEventData,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect, SvgXml } from "react-native-svg";
import { STAMPS_OFF, STAMPS_ON } from "../ratingStamps";
import { canPost, emptyDraft, isFullReview, spill, type Draft, type Step } from "../reviewDraft";
import { useSession } from "../session";
import { labelColor } from "../storyDraft";

const SERIF = "InstrumentSerif_400Regular";
const SANS = "InstrumentSans_400Regular";
const SANS_MEDIUM = "InstrumentSans_500Medium";
const SANS_SEMI = "InstrumentSans_600SemiBold";
const INK = "#111";
const BG = "#EEEEEE";

// Read when an animation starts, so no component re-renders on the setting.
let reduceMotion = false;
void AccessibilityInfo.isReduceMotionEnabled().then((on) => (reduceMotion = on));
AccessibilityInfo.addEventListener("reduceMotionChanged", (on) => (reduceMotion = on));
const ms = (duration: number) => (reduceMotion ? 0 : duration);
const EASE_OUT = Easing.bezier(0.2, 0.8, 0.2, 1);
const EASE_IN = Easing.bezier(0.4, 0, 1, 1);
const SWIPE_CLEAR = 110;

/** "Write a review": pick an album, optionally rate it, write a take, post. Opened by the navbar's pencil. */
export default function Write() {
  const [step, setStep] = useState<Step>({ kind: "pick" });
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [rateOpen, setRateOpen] = useState(false);

  switch (step.kind) {
    case "pick":
      return <Picker onPick={(album) => setStep({ kind: "compose", album })} />;
    case "compose":
      return (
        <Composer
          album={step.album}
          draft={draft}
          setDraft={setDraft}
          rateOpen={rateOpen}
          setRateOpen={setRateOpen}
          onRepick={() => setStep({ kind: "pick" })}
          onPosted={(review) => setStep({ kind: "posted", review })}
        />
      );
    case "posted":
      return <Posted review={step.review} />;
  }
}

function TopBar({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <View style={s.bar}>
      <Pressable role="button" onPress={() => router.back()} hitSlop={8} style={s.cancel}>
        <Text style={s.cancelText}>Cancel</Text>
      </Pressable>
      <Text style={s.barTitle}>{title}</Text>
      <View style={s.barSide}>{right}</View>
    </View>
  );
}

function Picker({ onPick }: { onPick: (album: SearchResult) => void }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const debounced = useDebounce(text.trim().toLowerCase(), 500);
  const query = debounced.length >= 2 ? debounced : "";
  const search = useSearchAlbums(query);
  const recent = useRecentlyViewed();
  const recordView = useRecordView();
  const list = query ? search : recent;
  const albums = list.data?.results ?? [];

  const pick = (album: SearchResult) => {
    recordView.mutate(String(album.id)); // fire-and-forget: the composer never waits on it
    onPick(album);
  };

  const label = query ? (albums.length === 1 ? "1 album" : `${albums.length} albums`) : "Recently viewed";
  let note: string | null = null;
  if (list.isError) note = query ? "Search isn't working right now. Try again in a moment." : "Couldn't load recently viewed albums.";
  else if (!list.isLoading && albums.length === 0)
    note = query ? `Nothing matches “${text.trim()}”. Try an artist name.` : "Albums you open from search show up here.";

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <TopBar title="New review" />
      <View style={s.pickHead}>
        <Text style={s.pickTitle}>What are you listening to?</Text>
        <View style={s.searchBox}>
          <Svg width={17} height={17} viewBox="0 0 20 20" fill="none" stroke="#6A6A6A" strokeWidth={1.7} strokeLinecap="round">
            <Circle cx={8.5} cy={8.5} r={6} />
            <Path d="M13 13 L18 18" />
          </Svg>
          <TextInput
            style={s.searchInput}
            value={text}
            onChangeText={setText}
            placeholder="Search albums or artists"
            placeholderTextColor="#8A8A8A"
            accessibilityLabel="Search albums"
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
        </View>
        <Text style={s.listLabel}>{label}</Text>
      </View>
      <FlatList
        data={albums}
        keyExtractor={(a) => String(a.id)}
        style={query && search.isPlaceholderData ? s.stale : undefined}
        contentContainerStyle={[s.list, { paddingBottom: 32 + insets.bottom }]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => (
          <Rise delay={Math.min(index, 8) * 30}>
            <AlbumRow album={item} onPress={() => pick(item)} />
          </Rise>
        )}
        ListEmptyComponent={list.isLoading ? <ActivityIndicator style={s.spinner} /> : note ? <Text style={s.note}>{note}</Text> : null}
      />
    </View>
  );
}

function AlbumRow({ album, onPress }: { album: SearchResult; onPress: () => void }) {
  return (
    <Pressable role="button" onPress={onPress} style={({ pressed }) => [s.row, pressed && s.rowPressed]}>
      <Cover uri={album.cover_image} style={s.rowCover} />
      <View style={s.rowText}>
        <Text style={s.rowTitle} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={s.meta}>{byline(album.artist, album.year)}</Text>
      </View>
    </Pressable>
  );
}

function Composer({
  album,
  draft,
  setDraft,
  rateOpen,
  setRateOpen,
  onRepick,
  onPosted,
}: {
  album: SearchResult;
  draft: Draft;
  setDraft: (update: (d: Draft) => Draft) => void;
  rateOpen: boolean;
  setRateOpen: (open: boolean) => void;
  onRepick: () => void;
  onPosted: (review: Review) => void;
}) {
  const insets = useSafeAreaInsets();
  const username = useSession()?.username ?? "";
  const { createReviewMutation: create } = useCreateReview(username);
  const headRef = useRef<TextInput>(null);
  const bodyRef = useRef<TextInput>(null);
  const bodySel = useRef({ start: 0, end: 0 });
  const full = isFullReview(draft.body);
  const postable = canPost(draft) && !create.isPending;

  const post = () => {
    if (!postable) return;
    create.mutate(
      { discogsId: String(album.id), rating: draft.rating, headline: draft.headline, body: draft.body },
      { onSuccess: onPosted },
    );
  };

  // The hidden twin below lays the headline out at the input's width; what passes 3 lines or 150 chars moves to the body.
  const onHeadLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const lines = e.nativeEvent.lines.map((l) => l.text);
    const { headline, rest } = spill(lines);
    if (!rest) return;
    // A second layout of the same text must not move the overflow twice.
    setDraft((d) => (d.headline !== lines.join("") ? d : { ...d, headline, body: rest + (d.body ? " " + d.body : "") }));
    requestAnimationFrame(() => {
      bodyRef.current?.focus();
      bodyRef.current?.setSelection(rest.length, rest.length);
    });
  };

  const [rateOrigin, setRateOrigin] = useState("50% 40%");
  const clearRating = () => setDraft((d) => ({ ...d, rating: null }));

  const focusHeadEnd = () => {
    headRef.current?.focus();
    headRef.current?.setSelection(draft.headline.length, draft.headline.length);
  };

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <TopBar
        title={full ? "Full review" : "New review"}
        right={
          <Pressable
            role="button"
            onPress={post}
            disabled={!postable}
            accessibilityState={{ disabled: !postable, busy: create.isPending }}
            style={[s.post, { backgroundColor: canPost(draft) ? "#1d1d1d" : "#D8D8D8" }]}
          >
            {create.isPending ? (
              <ActivityIndicator color="#EEEEEE" size="small" />
            ) : (
              <Text style={[s.postText, { color: canPost(draft) ? "#EEEEEE" : "#8A8A8A" }]}>Post</Text>
            )}
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={[s.compose, { paddingBottom: 40 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View style={s.hero}>
          <Pressable role="button" onPress={onRepick} accessibilityLabel={`Change album: ${album.title}`}>
            <Cover uri={album.cover_image} style={s.heroCover} />
          </Pressable>
          <View style={s.heroText}>
            <Text style={s.heroTitle}>{album.title}</Text>
            <Text style={s.heroMeta}>{byline(album.artist, album.year)}</Text>
          </View>
        </View>

        <SwipeToClear enabled={draft.rating !== null} onClear={clearRating}>
          <Pressable
            role="button"
            onPress={(e) => {
              setRateOrigin(`${e.nativeEvent.pageX}px ${e.nativeEvent.pageY}px`);
              setRateOpen(true);
            }}
            accessibilityLabel={draft.rating ? `Rating: ${draft.rating} out of 10. Change rating` : "Add rating"}
            accessibilityActions={draft.rating ? [{ name: "clear", label: "Clear rating" }] : undefined}
            onAccessibilityAction={(e) => e.nativeEvent.actionName === "clear" && clearRating()}
            style={s.rateRow}
          >
            {draft.rating ? (
              <>
                <Pulse key={draft.rating}>
                  <SvgXml xml={STAMPS_ON[draft.rating - 1]} width={40} height={40} />
                </Pulse>
                <Text style={s.rateLabel}>{draft.rating} out of 10</Text>
                <Text style={s.rateChange}>Change</Text>
              </>
            ) : (
              <>
                <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round">
                  <Path d="M9 3 V15 M3 9 H15" />
                </Svg>
                <Text style={s.rateLabel}>Add rating</Text>
                <Text style={s.optional}>Optional</Text>
              </>
            )}
          </Pressable>
        </SwipeToClear>

        <View style={s.writing}>
          <View style={s.writingHead}>
            <Text style={s.writingLabel}>Your take</Text>
            <Text style={s.meta12}>{full ? "Full review" : "Short take"}</Text>
          </View>
          <View style={s.card}>
            <View>
              <Text style={[s.headline, s.twin]} onTextLayout={onHeadLayout} aria-hidden>
                {draft.headline}
              </Text>
              <TextInput
                ref={headRef}
                style={s.headline}
                value={draft.headline}
                onChangeText={(t) => setDraft((d) => ({ ...d, headline: t.replace(/\n/g, " ") }))}
                placeholder="Say it in three lines."
                placeholderTextColor="#8A8A8A"
                accessibilityLabel="Your take"
                multiline
                scrollEnabled={false}
                submitBehavior="submit"
                returnKeyType="next"
                onSubmitEditing={() => bodyRef.current?.focus()}
              />
            </View>
            <View style={[s.rule, { backgroundColor: full ? "#C6C6C6" : "#DFDFDF" }]} />
            <TextInput
              ref={bodyRef}
              style={[s.body, { minHeight: full ? 200 : 60 }]}
              value={draft.body}
              onChangeText={(t) => setDraft((d) => ({ ...d, body: t }))}
              onSelectionChange={(e) => (bodySel.current = e.nativeEvent.selection)}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === "Backspace" && bodySel.current.start === 0 && bodySel.current.end === 0) focusHeadEnd();
              }}
              onFocus={() => draft.headline === "" && headRef.current?.focus()}
              placeholder="Keep going and it becomes a full review."
              placeholderTextColor="#8A8A8A"
              accessibilityLabel="Full review"
              multiline
              scrollEnabled={false}
            />
          </View>
          <Text style={s.hint}>
            {full
              ? "The serif lines are your headline in Activity. The rest opens when people tap in."
              : "Three lines is a short take. Keep writing and it turns into a full review."}
          </Text>
          {create.isError && <Text style={s.error}>{create.error.message}</Text>}
        </View>
      </ScrollView>

      {rateOpen && (
        <RateSheet
          title={album.title}
          origin={rateOrigin}
          rating={draft.rating}
          onPick={(rating) => {
            setDraft((d) => ({ ...d, rating }));
            setRateOpen(false);
          }}
          onClose={() => setRateOpen(false)}
        />
      )}
    </View>
  );
}

function RateSheet({
  title,
  origin,
  rating,
  onPick,
  onClose,
}: {
  title: string;
  /** Where the tap that opened it landed: the sheet grows from and shrinks back to it. */
  origin: string;
  rating: number | null;
  onPick: (rating: number) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  // 0 → 1 opens, 1 → 2 closes.
  const t = useAnimatedValue(0);
  const closing = useRef(false);
  const [picked, setPicked] = useState(rating);
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: ms(260), easing: EASE_OUT, useNativeDriver: true }).start();
  }, [t]);
  const close = (then: () => void, delay = 0) => {
    if (closing.current) return;
    closing.current = true;
    Animated.timing(t, { toValue: 2, duration: ms(200), delay: ms(delay), easing: EASE_IN, useNativeDriver: true }).start(then);
  };
  const sheet = {
    transformOrigin: origin,
    opacity: t.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 1, 0] }),
    transform: [{ scale: t.interpolate({ inputRange: [0, 1, 2], outputRange: [0.92, 1, 0.94] }) }],
  };
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, s.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }, sheet]}
      accessibilityViewIsModal
      aria-label={`Rate ${title}`}
    >
      <View style={s.bar}>
        <Pressable role="button" onPress={() => close(onClose)} accessibilityLabel="Close" style={s.close}>
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round">
            <Path d="M2 2 L12 12 M12 2 L2 12" />
          </Svg>
        </Pressable>
        <Text style={s.barTitle}>Rate</Text>
        <View style={s.close} />
      </View>
      <ScrollView contentContainerStyle={s.stamps} accessibilityLabel="Rating out of 10">
        {STAMPS_ON.map((_, i) => 10 - i).map((n) => (
          <Rise key={n} delay={(10 - n) * 30}>
            <Pressable
              role="button"
              onPress={() => {
                setPicked(n);
                // A beat to see the stamp land before the sheet closes.
                close(() => onPick(n), 280);
              }}
              accessibilityLabel={`Rate ${n} out of 10`}
              accessibilityState={{ selected: n === picked }}
              style={[s.stamp, n === picked && s.stampPicked]}
            >
              <SvgXml xml={(n === picked ? STAMPS_ON : STAMPS_OFF)[n - 1]} width={52} height={52} />
            </Pressable>
          </Rise>
        ))}
      </ScrollView>
      {rating !== null && (
        <Rise delay={330} style={s.sheetFoot}>
          <Pressable role="button" onPress={() => close(onClose)} style={s.sheetCancel}>
            <Text style={s.sheetCancelText}>Cancel</Text>
          </Pressable>
        </Rise>
      )}
    </Animated.View>
  );
}

/** Fades and lifts its child in on mount, `delay` ms late. */
function Rise({ delay, style, children }: { delay: number; style?: object; children: ReactNode }) {
  const t = useAnimatedValue(0);
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: ms(300), delay: ms(delay), easing: EASE_OUT, useNativeDriver: true }).start();
  }, [t, delay]);
  const lift = t.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  return <Animated.View style={[style, { opacity: t, transform: [{ translateY: lift }] }]}>{children}</Animated.View>;
}

/** The rating stamp's arrival: pops past full size and settles. Remount (a new key) to replay. */
function Pulse({ children }: { children: ReactNode }) {
  const t = useAnimatedValue(0);
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: ms(420), easing: EASE_OUT, useNativeDriver: true }).start();
  }, [t]);
  const scale = t.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0.6, 1.14, 1] });
  const opacity = t.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, 1, 1] });
  return <Animated.View style={{ opacity, transform: [{ scale }] }}>{children}</Animated.View>;
}

/** Drag the row right past SWIPE_CLEAR and let go to clear. Taps still reach the row. */
function SwipeToClear({ enabled, onClear, children }: { enabled: boolean; onClear: () => void; children: ReactNode }) {
  const x = useAnimatedValue(0);
  const [past, setPast] = useState(false);
  // The responder is created once; it reads the latest props through this ref.
  const latest = useRef({ enabled, onClear });
  useEffect(() => {
    latest.current = { enabled, onClear };
  });
  // eslint-disable-next-line react-hooks/refs -- the handlers read `latest` during a gesture, never during render
  const [pan] = useState(() => {
    const settle = () => {
      setPast(false);
      Animated.timing(x, { toValue: 0, duration: ms(260), easing: EASE_OUT, useNativeDriver: true }).start();
    };
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => latest.current.enabled && Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => {
        // Past either edge the row resists, following at a quarter of the finger.
        const v = g.dx < 0 ? Math.max(g.dx * 0.25, -28) : g.dx > 300 ? 300 + (g.dx - 300) * 0.25 : g.dx;
        x.setValue(v);
        setPast(v >= SWIPE_CLEAR);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < SWIPE_CLEAR) return settle();
        Animated.timing(x, { toValue: 360, duration: ms(240), easing: EASE_OUT, useNativeDriver: true }).start(() => {
          latest.current.onClear();
          x.setValue(0);
          setPast(false);
        });
      },
      onPanResponderTerminate: settle,
    });
  });
  return (
    <View style={[s.swipe, enabled && { backgroundColor: past ? "#B3261E" : "#7A7A7A" }]} {...pan.panHandlers}>
      {enabled && (
        <Animated.View
          style={[s.swipeHint, { opacity: x.interpolate({ inputRange: [0, 60], outputRange: [0, 1], extrapolate: "clamp" }) }]}
          aria-hidden
        >
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="#FAFAF8" strokeWidth={1.7} strokeLinecap="round">
            <Path d="M2 2 L12 12 M12 2 L2 12" />
          </Svg>
          <Text style={s.swipeLabel}>{past ? "Release to clear" : "Clear rating"}</Text>
        </Animated.View>
      )}
      <Animated.View style={{ transform: [{ translateX: x }] }}>{children}</Animated.View>
    </View>
  );
}

function Posted({ review }: { review: Review }) {
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

function Cover({ uri, style }: { uri?: string; style: object }) {
  return uri ? <Image source={{ uri }} style={style} accessibilityIgnoresInvertColors /> : <View style={[style, s.noCover]} />;
}

const byline = (artist: string, year?: number) => (year ? `${artist} · ${year}` : artist);

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  bar: { height: 60, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cancel: { minWidth: 64, minHeight: 44, justifyContent: "center", paddingHorizontal: 8 },
  cancelText: { fontFamily: SANS, fontSize: 15, color: INK },
  barTitle: { fontFamily: SANS_SEMI, fontSize: 15, color: INK },
  barSide: { minWidth: 64, alignItems: "flex-end" },
  post: { minWidth: 64, minHeight: 36, paddingHorizontal: 16, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  postText: { fontFamily: SANS_SEMI, fontSize: 14 },

  pickHead: { paddingTop: 4, paddingHorizontal: 20 },
  pickTitle: { marginBottom: 14, fontFamily: SERIF, fontSize: 34, lineHeight: 36, color: INK },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10, height: 48, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#FFFFFF" },
  searchInput: { flex: 1, minWidth: 0, fontFamily: SANS, fontSize: 16, color: INK },
  listLabel: { marginTop: 20, marginBottom: 6, fontFamily: SANS_SEMI, fontSize: 13, color: "#6A6A6A" },
  list: { paddingHorizontal: 12 },
  stale: { opacity: 0.5 },
  spinner: { marginTop: 24 },
  note: { marginVertical: 18, marginHorizontal: 8, fontFamily: SANS, fontSize: 14, lineHeight: 21, color: "#666" },
  row: { minHeight: 72, padding: 8, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 14 },
  rowPressed: { backgroundColor: "#E4E4E4" },
  rowCover: { width: 56, height: 56, borderRadius: 2 },
  rowText: { flex: 1, minWidth: 0, gap: 3 },
  rowTitle: { fontFamily: SERIF, fontSize: 21, lineHeight: 23, color: INK },
  meta: { fontFamily: SANS, fontSize: 13, color: "#666" },
  noCover: { backgroundColor: "#D8D8D8" },

  compose: { paddingTop: 6, paddingHorizontal: 20, gap: 22 },
  hero: { alignItems: "center", gap: 14 },
  heroCover: { width: 272, height: 272, borderRadius: 4 },
  heroText: { alignItems: "center", gap: 4 },
  heroTitle: { fontFamily: SERIF, fontSize: 36, lineHeight: 36, color: INK, textAlign: "center" },
  heroMeta: { fontFamily: SANS, fontSize: 13, color: "#555", textAlign: "center" },
  swipe: { borderRadius: 16, overflow: "hidden" },
  swipeHint: { position: "absolute", left: 0, top: 0, bottom: 0, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 8 },
  swipeLabel: { fontFamily: SANS_SEMI, fontSize: 14, color: "#FAFAF8" },
  rateRow: { minHeight: 60, paddingHorizontal: 16, borderRadius: 16, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", gap: 12 },
  rateLabel: { flex: 1, fontFamily: SANS_MEDIUM, fontSize: 15, color: INK },
  rateChange: { fontFamily: SANS, fontSize: 13, color: "#666" },
  optional: { fontFamily: SANS, fontSize: 12, color: "#8A8A8A" },
  writing: { gap: 8 },
  writingHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  writingLabel: { fontFamily: SANS_SEMI, fontSize: 13, color: INK },
  meta12: { fontFamily: SANS, fontSize: 12, color: "#666" },
  card: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12, borderRadius: 16, backgroundColor: "#FFFFFF" },
  headline: { height: 90, padding: 0, fontFamily: SERIF, fontSize: 26, lineHeight: 30, color: INK },
  twin: { position: "absolute", top: 0, left: 0, right: 0, height: undefined, opacity: 0, pointerEvents: "none" },
  rule: { marginTop: 8, marginBottom: 10, height: 1 },
  body: { padding: 0, fontFamily: SANS, fontSize: 15, lineHeight: 23, color: "#222", textAlignVertical: "top" },
  hint: { fontFamily: SANS, fontSize: 12, lineHeight: 18, color: "#666" },
  error: { fontFamily: SANS_MEDIUM, fontSize: 13, color: "#B3261E" },

  close: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  stamps: { flexGrow: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingBottom: 20 },
  stamp: { width: 52, height: 52 },
  stampPicked: { transform: [{ scale: 1.18 }] },
  sheetFoot: { paddingHorizontal: 20, paddingBottom: 28 },
  sheetCancel: { minHeight: 52, borderRadius: 10, backgroundColor: "#E2E2E2", alignItems: "center", justifyContent: "center" },
  sheetCancelText: { fontFamily: SANS_MEDIUM, fontSize: 16, color: INK },

  posted: { flexGrow: 1, alignItems: "center", paddingHorizontal: 24 },
  postedHead: { alignItems: "center", gap: 2 },
  postedTitle: { fontFamily: SERIF, fontSize: 46, lineHeight: 48, color: "#F7F7F5" },
  postedNote: { fontFamily: SANS, fontSize: 13, color: "#F7F7F5" },
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
  sleeveTitle: { flexShrink: 1, fontFamily: SANS_SEMI, fontSize: 12, color: INK },
  sleeveMeta: { fontFamily: SANS, fontSize: 12, color: "#6A6A6A" },
  sleeveHead: { marginTop: 10, fontFamily: SERIF, color: INK },
  sleeveFoot: { marginTop: 14, paddingTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sleeveBy: { flexShrink: 1, fontFamily: SANS, fontSize: 11, color: "#555" },
  sleeveUser: { fontFamily: SANS_SEMI, color: INK },
  wordmark: { fontFamily: "InstrumentSerifItalic", fontSize: 16, color: INK },
  actions: { marginTop: "auto", paddingTop: 28, width: "100%", gap: 10 },
  shareBtn: { minHeight: 52, borderRadius: 10, backgroundColor: "#FAFAF8", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  shareText: { fontFamily: SANS_SEMI, fontSize: 16, color: INK },
  feedBtn: { minHeight: 52, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  feedText: { fontFamily: SANS_MEDIUM, fontSize: 16, color: "#F7F7F5" },
});
