import type { Song } from "@halfnote/data";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, useAnimatedValue, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, SvgXml } from "react-native-svg";
import { INK, TrackRow } from "../components";
import { STAMPS_OFF, STAMPS_ON } from "../ratingStamps";
import { F } from "../story/kit";
import { shared } from "./bits";
import { EASE_IN, EASE_OUT, Rise, ms } from "./motion";

type Close = (then: () => void, delay?: number) => void;

/** A full-screen picker that grows from the tap that opened it and shrinks back to it. */
function Sheet({
  title,
  label,
  origin,
  cancellable,
  onClose,
  children,
}: {
  title: string;
  label: string;
  origin: string;
  /** Show Cancel: there is a current value to keep. */
  cancellable: boolean;
  onClose: () => void;
  children: (close: Close) => ReactNode;
}) {
  const insets = useSafeAreaInsets();
  // 0 → 1 opens, 1 → 2 closes.
  const t = useAnimatedValue(0);
  const closing = useRef(false);
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: ms(260), easing: EASE_OUT, useNativeDriver: true }).start();
  }, [t]);
  const close: Close = (then, delay = 0) => {
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
      style={[StyleSheet.absoluteFill, shared.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }, sheet]}
      accessibilityViewIsModal
      aria-label={label}
    >
      <View style={shared.bar}>
        <Pressable role="button" onPress={() => close(onClose)} accessibilityLabel="Close" style={s.close}>
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round">
            <Path d="M2 2 L12 12 M12 2 L2 12" />
          </Svg>
        </Pressable>
        <Text style={shared.barTitle}>{title}</Text>
        <View style={s.close} />
      </View>
      {/* eslint-disable-next-line react-hooks/refs -- close reads `closing` on press, never during render */}
      {children(close)}
      {cancellable && (
        <Rise delay={330} style={s.sheetFoot}>
          <Pressable role="button" onPress={() => close(onClose)} style={s.sheetCancel}>
            <Text style={s.sheetCancelText}>Cancel</Text>
          </Pressable>
        </Rise>
      )}
    </Animated.View>
  );
}

export function RateSheet({
  title,
  origin,
  rating,
  onPick,
  onClose,
}: {
  title: string;
  origin: string;
  rating: number | null;
  onPick: (rating: number) => void;
  onClose: () => void;
}) {
  const [picked, setPicked] = useState(rating);
  return (
    <Sheet title="Rate" label={`Rate ${title}`} origin={origin} cancellable={rating !== null} onClose={onClose}>
      {(close) => (
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
      )}
    </Sheet>
  );
}

const minutes = (sec: number | null) => (sec == null ? "" : `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`);

/** The album's songs as the Activity tracklist draws them; the picked one is inverted. */
export function SongSheet({
  title,
  origin,
  songs,
  songId,
  onPick,
  onClose,
}: {
  title: string;
  origin: string;
  songs: Song[];
  songId: number | null;
  onPick: (songId: number) => void;
  onClose: () => void;
}) {
  const [picked, setPicked] = useState(songId);
  return (
    <Sheet title="Favourite song" label={`Favourite song on ${title}`} origin={origin} cancellable={songId !== null} onClose={onClose}>
      {(close) => (
        <ScrollView contentContainerStyle={s.songs}>
          {songs.map((song, i) => (
            <Rise key={song.id} delay={Math.min(i, 10) * 30}>
              <Pressable
                role="button"
                onPress={() => {
                  setPicked(song.id);
                  close(() => onPick(song.id), 280);
                }}
                accessibilityState={{ selected: song.id === picked }}
              >
                <TrackRow position={song.position} title={song.title} length={minutes(song.duration_seconds)} on={song.id === picked} />
              </Pressable>
            </Rise>
          ))}
        </ScrollView>
      )}
    </Sheet>
  );
}

const s = StyleSheet.create({
  close: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  stamps: { flexGrow: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingBottom: 20 },
  stamp: { width: 52, height: 52 },
  stampPicked: { transform: [{ scale: 1.18 }] },
  sheetFoot: { paddingHorizontal: 20, paddingBottom: 28 },
  songs: { paddingHorizontal: 20, paddingBottom: 20 },
  sheetCancel: { minHeight: 52, borderRadius: 10, backgroundColor: "#E2E2E2", alignItems: "center", justifyContent: "center" },
  sheetCancelText: { fontFamily: F.sans500, fontSize: 16, color: INK },
});
