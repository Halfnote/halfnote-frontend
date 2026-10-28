import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import { Caveat_500Medium, Caveat_700Bold } from "@expo-google-fonts/caveat";
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from "@expo-google-fonts/ibm-plex-mono";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { PermanentMarker_400Regular } from "@expo-google-fonts/permanent-marker";
import { PirataOne_400Regular } from "@expo-google-fonts/pirata-one";
import { Yellowtail_400Regular } from "@expo-google-fonts/yellowtail";
import { useAlbumDetails } from "@halfnote/data/react";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useSession } from "../session";
import { usePlus } from "../usePlus";
import { useShareToStory } from "../useShareToStory";
import { F, font } from "../story/kit";
import { STORY_H, STORY_W, Story } from "../story/Story";
import { ElementsStep, FILL, INK, PrimaryButton, SnippetStep, Star, StyleStep } from "../story/steps";
import {
  activeStyle,
  currentStep,
  elements,
  GENRES,
  initialDraft,
  nextBlocked,
  steps,
  storyContent,
  type Source,
  type Step,
} from "../storyDraft";

const STEP_NAMES: Record<Step, string> = { elements: "Elements", snippet: "Snippet", style: "Style" };

/** Full-screen "Share to Story" flow: a live story preview over a stepped sheet. Opened from the album screen. */
export default function ShareStory() {
  // Only ids travel in the route; the album and its reviews come from the album screen's query cache.
  const { discogsId, reviewId } = useLocalSearchParams<{ discogsId: string; reviewId?: string }>();
  const { data } = useAlbumDetails(discogsId);
  // The story styles' display faces load here rather than at app start, which only needs Instrument (app/_layout.tsx).
  const [fontsLoaded, fontError] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    Pacifico_400Regular,
    Caveat_500Medium,
    Caveat_700Bold,
    AlfaSlabOne_400Regular,
    PirataOne_400Regular,
    PermanentMarker_400Regular,
    Yellowtail_400Regular,
  });
  if (!data || (!fontsLoaded && !fontError)) return <ActivityIndicator style={{ flex: 1 }} />;
  const review = reviewId ? data.reviews.find((r) => String(r.id) === reviewId) : undefined;
  if (reviewId && !review) return <Text style={{ flex: 1, textAlign: "center", marginTop: 96 }}>Review not found</Text>;
  return <ShareFlow source={review ? { album: data.album, review } : { album: data.album, rating: data.average_rating ?? undefined }} />;
}

function ShareFlow({ source }: { source: Source }) {
  const viewer = useSession()?.username ?? "";
  const [draft, setDraft] = useState(initialDraft);
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const flash = useCallback((message: string) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const c = storyContent(source, draft, viewer);
  const { genre, variant } = activeStyle(source, draft);
  const { index, step } = currentStep(source, draft);
  const all = steps(source, draft);
  const blocked = nextBlocked(source, draft);
  const kind = !("review" in source) ? "Album" : elements(source).includes("body") ? "Full review" : "Short take";
  const exporter = useShareToStory({ c, genre, variant }, flash);
  const { plus, unlock } = usePlus();
  const isPlus = !!GENRES[genre].plus;
  const locked = isPlus && !plus;
  const go = (to: number) => setDraft((d) => ({ ...d, step: to }));

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: "#D6D6D2",
        experimental_backgroundImage: "radial-gradient(rgba(17,17,17,0.14) 0.7px, transparent 0.9px)",
        experimental_backgroundSize: "3px 3px",
      }}
    >
      <View style={{ height: 52, paddingHorizontal: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
        >
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round">
            <Path d="M2 2 L12 12 M12 2 L2 12" />
          </Svg>
        </Pressable>
        <View
          accessibilityLabel={`Sharing ${c.title}, ${kind}`}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            minHeight: 40,
            maxWidth: 280,
            paddingLeft: 6,
            paddingRight: 12,
            borderRadius: 999,
            backgroundColor: "rgba(238,238,238,0.85)",
          }}
        >
          <Image
            source={c.art ? { uri: c.art } : undefined}
            style={{ width: 28, height: 28, borderRadius: 2, backgroundColor: "#BDBDB8" }}
          />
          <Text numberOfLines={1} style={[font(F.sans500, 13), { color: INK, flexShrink: 1 }]}>
            {c.title}
          </Text>
          <Text
            style={[
              font(F.sans500, 10),
              { color: "#EEEEEE", backgroundColor: FILL, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 999, overflow: "hidden" },
            ]}
          >
            {kind}
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <Preview badge={isPlus}>
        <Story c={c} genre={genre} variant={variant} />
      </Preview>
      {exporter.capture}

      <View
        style={{
          backgroundColor: "#EEEEEE",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          boxShadow: "0 -12px 30px -20px rgba(0,0,0,0.4)",
          paddingTop: 10,
          paddingHorizontal: 16,
          paddingBottom: 18 + insets.bottom,
          height: 368 + insets.bottom,
          gap: 12,
        }}
      >
        <View style={{ alignSelf: "center", width: 36, height: 4, borderRadius: 999, backgroundColor: "rgba(17,17,17,0.18)" }} />
        <View accessibilityLabel="Export steps" style={{ flexDirection: "row", gap: 8 }}>
          {all.map((k, i) => (
            <View key={k} style={{ flex: 1, gap: 6 }} accessibilityState={{ selected: i === index }}>
              <Text style={[font(F.sans500, 12), { color: i <= index ? INK : "#8A8A8A" }]}>
                {i + 1} · {STEP_NAMES[k]}
              </Text>
              <View style={{ height: 3, borderRadius: 999, backgroundColor: i <= index ? FILL : "rgba(17,17,17,0.12)" }} />
            </View>
          ))}
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {step === "elements" && <ElementsStep source={source} draft={draft} setDraft={setDraft} />}
          {step === "snippet" && <SnippetStep source={source} draft={draft} setDraft={setDraft} />}
          {step === "style" && <StyleStep source={source} draft={draft} setDraft={setDraft} c={c} plus={plus} />}
        </ScrollView>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {index > 0 && (
            <Pressable
              onPress={() => go(index - 1)}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={{
                width: 48,
                minHeight: 48,
                borderWidth: 1,
                borderColor: INK,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Svg width={8} height={12} viewBox="0 0 8 12" fill="none" stroke={INK} strokeWidth={1.5}>
                <Path d="M6 1 L2 6 L6 11" />
              </Svg>
            </Pressable>
          )}
          {index < all.length - 1 && (
            <PrimaryButton
              label={`Next: ${STEP_NAMES[all[index + 1]]}`}
              disabled={blocked}
              onPress={() => go(index + 1)}
              trail={
                <Svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="#EEEEEE" strokeWidth={1.4}>
                  <Path d="M2 5 H8 M5.5 2.5 L8 5 L5.5 7.5" />
                </Svg>
              }
            />
          )}
          {index === all.length - 1 && locked && (
            <PrimaryButton
              label="Unlock halfnote Plus"
              onPress={() => {
                void unlock();
                flash("halfnote Plus unlocked");
              }}
              icon={<Star size={12} color="#EEEEEE" />}
            />
          )}
          {index === all.length - 1 && !locked && (
            <>
              <Pressable
                onPress={exporter.save}
                accessibilityRole="button"
                style={{
                  minHeight: 48,
                  paddingHorizontal: 18,
                  borderWidth: 1,
                  borderColor: INK,
                  borderRadius: 999,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Svg
                  width={14}
                  height={14}
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke={INK}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M7 1.5 V9 M4 6 L7 9 L10 6 M2 12.5 H12" />
                </Svg>
                <Text style={[font(F.sans500, 14), { color: INK }]}>Save</Text>
              </Pressable>
              <PrimaryButton
                label="Share to Story"
                onPress={exporter.share}
                icon={
                  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="#EEEEEE" strokeWidth={1.5}>
                    <Rect x={2} y={2} width={12} height={12} rx={3.5} />
                    <Circle cx={8} cy={8} r={2.8} />
                  </Svg>
                }
              />
            </>
          )}
        </View>
      </View>
      {!!toast && (
        <View
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={{
            position: "absolute",
            alignSelf: "center",
            bottom: 368 + insets.bottom + 16,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 999,
            backgroundColor: FILL,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 12px 24px -12px rgba(0,0,0,0.6)",
          }}
        >
          <Svg
            width={12}
            height={10}
            viewBox="0 0 12 10"
            fill="none"
            stroke="#EEEEEE"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M1 5 L4.5 8.5 L11 1.5" />
          </Svg>
          <Text style={[font(F.sans500, 13), { color: "#EEEEEE" }]}>{toast}</Text>
        </View>
      )}
    </View>
  );
}

/** Scales the 360×640 story to fit the space above the sheet, with the design's rounded frame. */
function Preview({ children, badge }: { children: ReactNode; badge: boolean }) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const scale = Math.min((box.h - 8) / STORY_H, (box.w - 32) / STORY_W);
  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
    >
      {scale > 0 && (
        <View
          style={{
            width: STORY_W * scale,
            height: STORY_H * scale,
            borderRadius: 12,
            boxShadow: "0 26px 44px -22px rgba(0,0,0,0.6), 0 0 0 1px rgba(17,17,17,0.12)",
          }}
        >
          <View style={{ flex: 1, borderRadius: 12, overflow: "hidden" }}>
            <View style={{ transform: [{ scale }], transformOrigin: "top left" }}>{children}</View>
          </View>
          {badge && (
            <View
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingVertical: 4,
                paddingHorizontal: 9,
                borderRadius: 999,
                backgroundColor: "rgba(17,17,17,0.82)",
              }}
            >
              <Star size={10} color="#EEEEEE" />
              <Text style={[font(F.sans600, 11, undefined, 0.04), { color: "#EEEEEE" }]}>PLUS</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
