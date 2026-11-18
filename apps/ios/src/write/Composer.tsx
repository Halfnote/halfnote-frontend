import type { Review, SearchResult } from "@halfnote/data";
import { useAlbumDetails, useCreateReview } from "@halfnote/data/react";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type NativeSyntheticEvent, type TextLayoutEventData } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, SvgXml } from "react-native-svg";
import { INK } from "../components";
import { STAMPS_ON } from "../ratingStamps";
import { canPost, isFullReview, spill, type Draft } from "../reviewDraft";
import { useSession } from "../session";
import { F } from "../story/kit";
import { Cover, TopBar, byline, shared } from "./bits";
import { Pulse } from "./motion";
import { RateSheet, SongSheet } from "./sheets";

export function Composer({
  album,
  draft,
  setDraft,
  onRepick,
  onPosted,
}: {
  album: SearchResult;
  draft: Draft;
  setDraft: (update: (d: Draft) => Draft) => void;
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
      { discogsId: String(album.id), rating: draft.rating, headline: draft.headline, body: draft.body, favoriteSongId: draft.favoriteSongId },
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

  const [rateOpen, setRateOpen] = useState(false);
  const [rateOrigin, setRateOrigin] = useState("50% 40%");

  // Viewing the album imports it, which is what creates its songs.
  const songs = useAlbumDetails(String(album.id)).data?.album.songs ?? [];
  const song = songs.find((x) => x.id === draft.favoriteSongId);
  const [songOrigin, setSongOrigin] = useState<string>();

  const focusHeadEnd = () => {
    headRef.current?.focus();
    headRef.current?.setSelection(draft.headline.length, draft.headline.length);
  };

  return (
    <View style={[shared.screen, { paddingTop: insets.top }]}>
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

        <Pressable
          role="button"
          onPress={(e) => {
            setRateOrigin(`${Math.round(e.nativeEvent.pageX)}px ${Math.round(e.nativeEvent.pageY)}px`);
            setRateOpen(true);
          }}
          accessibilityLabel={draft.rating ? `Rating: ${draft.rating} out of 10. Change rating` : "Add rating"}
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

        {songs.length > 0 && (
          <Pressable
            role="button"
            onPress={(e) => setSongOrigin(`${Math.round(e.nativeEvent.pageX)}px ${Math.round(e.nativeEvent.pageY)}px`)}
            accessibilityLabel={song ? `Favourite song: ${song.title}. Change favourite song` : "Add favourite song"}
            style={s.rateRow}
          >
            {song ? (
              <>
                <Text style={s.songPos}>{song.position}</Text>
                <Text style={s.rateLabel} numberOfLines={1}>
                  {song.title}
                </Text>
                <Text style={s.rateChange}>Change</Text>
              </>
            ) : (
              <>
                <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round">
                  <Path d="M9 3 V15 M3 9 H15" />
                </Svg>
                <Text style={s.rateLabel}>Add favourite song</Text>
                <Text style={s.optional}>Optional</Text>
              </>
            )}
          </Pressable>
        )}

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
      {songOrigin && (
        <SongSheet
          title={album.title}
          origin={songOrigin}
          songs={songs}
          songId={draft.favoriteSongId}
          onPick={(favoriteSongId) => {
            setDraft((d) => ({ ...d, favoriteSongId }));
            setSongOrigin(undefined);
          }}
          onClose={() => setSongOrigin(undefined)}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  post: { minWidth: 64, minHeight: 36, paddingHorizontal: 16, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  postText: { fontFamily: F.sans600, fontSize: 14 },
  compose: { paddingTop: 6, paddingHorizontal: 20, gap: 22 },
  hero: { alignItems: "center", gap: 14 },
  heroCover: { width: 272, height: 272, borderRadius: 4 },
  heroText: { alignItems: "center", gap: 4 },
  heroTitle: { fontFamily: F.serif, fontSize: 36, lineHeight: 36, color: INK, textAlign: "center" },
  heroMeta: { fontFamily: F.sans, fontSize: 13, color: "#555", textAlign: "center" },
  rateRow: { minHeight: 60, paddingHorizontal: 16, borderRadius: 16, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", gap: 12 },
  rateLabel: { flex: 1, fontFamily: F.sans500, fontSize: 15, color: INK },
  rateChange: { fontFamily: F.sans, fontSize: 13, color: "#666" },
  optional: { fontFamily: F.sans, fontSize: 12, color: "#8A8A8A" },
  writing: { gap: 8 },
  writingHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  writingLabel: { fontFamily: F.sans600, fontSize: 13, color: INK },
  meta12: { fontFamily: F.sans, fontSize: 12, color: "#666" },
  card: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12, borderRadius: 16, backgroundColor: "#FFFFFF" },
  headline: { height: 90, padding: 0, fontFamily: F.serif, fontSize: 26, lineHeight: 30, color: INK },
  twin: { position: "absolute", top: 0, left: 0, right: 0, height: undefined, opacity: 0, pointerEvents: "none" },
  rule: { marginTop: 8, marginBottom: 10, height: 1 },
  body: { padding: 0, fontFamily: F.sans, fontSize: 15, lineHeight: 23, color: "#222", textAlignVertical: "top" },
  error: { fontFamily: F.sans500, fontSize: 13, color: "#B3261E" },
  songPos: { width: 28, fontFamily: F.sans, fontSize: 12, color: INK, opacity: 0.6 },
});
