import { useOnboardingAlbums, useSetFavoriteAlbums } from "@halfnote/data/react";
import { router } from "expo-router";
import { use, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { BG } from "../../components";
import { FieldError, Frame, Heading, PrimaryButton, TextButton } from "../../onboarding/bits";
import { OnboardingContext } from "../../onboarding/context";
import { MAX_PICKS, fromGrid, fromSearch, samePicks, spotOf, togglePick, type AlbumPick } from "../../onboarding/model";
import { Art, F } from "../../story/kit";
import { Pop } from "../../write/motion";
import { AlbumRow, SEARCH_FAILED, SearchBox, noMatches, useAlbumSearch } from "../../write/search";

export default function Albums() {
  const { answers, update } = use(OnboardingContext);
  const { picks, savedPicks } = answers;
  const [text, setText] = useState("");
  const { query, search } = useAlbumSearch(text);
  const grid = useOnboardingAlbums();
  const save = useSetFavoriteAlbums();
  const toggle = (album: AlbumPick) => {
    if (!save.isPending) update({ picks: togglePick(picks, album) });
  };

  const next = () => {
    if (samePicks(picks, savedPicks)) return router.push("/onboarding/face");
    save.mutate(
      picks.map((p) => p.discogsId),
      {
        onSuccess: () => {
          update({ savedPicks: picks });
          router.push("/onboarding/face");
        },
      },
    );
  };

  return (
    <Frame
      step={2}
      footer={
        <>
          <FieldError text={save.isError ? "Couldn't save your albums, try again" : undefined} />
          {picks.length > 0 || save.isPending ? (
            <PrimaryButton label="Continue" onPress={next} pending={save.isPending} />
          ) : (
            <TextButton label="Skip for now" onPress={next} />
          )}
        </>
      }
    >
      <View>
        <Heading>{"AlbumPick up to four that\nsay who you are"}</Heading>
        <Text style={s.intro}>They become the banner on your profile. You can swap them any time from Edit profile.</Text>
      </View>
      <View style={s.slots}>
        {Array.from({ length: MAX_PICKS }, (_, i) => {
          const album = picks[i];
          return album ? (
            <Pop key={album.discogsId} style={s.slot}>
              <Pressable role="button" accessibilityLabel={`Remove ${album.title} by ${album.artist}`} onPress={() => toggle(album)}>
                <Art uri={album.cover} style={s.slotArt} />
              </Pressable>
            </Pop>
          ) : (
            <View key={i} aria-hidden style={[s.slot, s.slotArt, s.slotEmpty]}>
              <Text style={s.slotNumber}>{i + 1}</Text>
            </View>
          );
        })}
      </View>
      <SearchBox value={text} onChangeText={setText} />
      {query ? (
        <View style={[s.results, search.isPlaceholderData && s.stale]}>
          {search.isLoading ? <ActivityIndicator style={s.spinner} /> : null}
          {search.isError ? <Text style={s.empty}>{SEARCH_FAILED}</Text> : null}
          {search.data?.results.length === 0 ? <Text style={s.empty}>{noMatches(text)}</Text> : null}
          {search.data?.results.map((a) => {
            const spot = spotOf(picks, String(a.id));
            return <AlbumRow key={a.id} album={a} selected={spot >= 0} onPress={() => toggle(fromSearch(a))} badge={spot >= 0 ? <Badge n={spot + 1} /> : null} />;
          })}
        </View>
      ) : (
        <View style={s.grid}>
          {grid.isLoading ? <ActivityIndicator style={s.spinner} /> : null}
          {grid.isError ? <Text style={s.empty}>{"Couldn't load albums. You can still search for one."}</Text> : null}
          {grid.data?.albums.map((a) => (
            <Tile key={a.discogs_id} album={fromGrid(a)} spot={spotOf(picks, a.discogs_id)} onPress={toggle} />
          ))}
        </View>
      )}
    </Frame>
  );
}

function Tile({ album, spot, onPress }: { album: AlbumPick; spot: number; onPress: (album: AlbumPick) => void }) {
  const on = spot >= 0;
  return (
    <Pressable
      role="button"
      aria-selected={on}
      accessibilityLabel={`${album.title} by ${album.artist}${on ? `, banner spot ${spot + 1}` : ""}`}
      onPress={() => onPress(album)}
      style={({ pressed }) => [s.tile, pressed && s.pressed]}
    >
      <Art uri={album.cover} filter={on ? undefined : "brightness(0.92)"} style={[s.tileArt, on && s.tileOn]} />
      {on ? (
        <View style={s.tileBadge}>
          <Badge n={spot + 1} />
        </View>
      ) : null}
    </Pressable>
  );
}

const Badge = ({ n }: { n: number }) => (
  <Pop style={s.badge}>
    <Text style={s.badgeText}>{n}</Text>
  </Pop>
);

const s = StyleSheet.create({
  intro: { marginTop: 10, fontFamily: F.sans, fontSize: 14, lineHeight: 20, color: "#555" },
  slots: { flexDirection: "row", gap: 4, marginTop: 4 },
  slot: { flex: 1 },
  slotArt: { aspectRatio: 1, borderRadius: 3 },
  slotEmpty: { backgroundColor: "#E0E0E0", alignItems: "center", justifyContent: "center" },
  slotNumber: { fontFamily: F.serif, fontSize: 22, color: "#9A9A9A" },
  results: { marginHorizontal: -8 },
  stale: { opacity: 0.5 },
  spinner: { flex: 1, marginTop: 24 },
  empty: { marginVertical: 12, marginHorizontal: 8, fontFamily: F.sans, fontSize: 14, lineHeight: 21, color: "#666" },
  // Padding on the tiles stands in for a 10-point gap, so three always fit whatever the width rounds to.
  grid: { flexDirection: "row", flexWrap: "wrap", margin: -5 },
  tile: { width: `${100 / 3}%`, padding: 5 },
  tileArt: { aspectRatio: 1, borderRadius: 3 },
  tileOn: { transform: [{ scale: 0.9 }] },
  tileBadge: { position: "absolute", right: 7, top: 7 },
  badge: { width: 26, height: 26, borderRadius: 13, backgroundColor: "#1d1d1d", alignItems: "center", justifyContent: "center" },
  badgeText: { fontFamily: F.sans600, fontSize: 13, color: BG },
  pressed: { transform: [{ scale: 0.97 }] },
});
