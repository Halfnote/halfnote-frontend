import { useAlbumDetails } from "@halfnote/data/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState, type ReactNode } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useSession } from "../session";
import { F, font } from "../story/kit";
import { STORY_H, STORY_W, Story } from "../story/Story";
import { ElementsStep, FILL, INK, PrimaryButton, SnippetStep, StyleStep } from "../story/steps";
import { activeStyle, currentStep, elements, initialDraft, nextBlocked, steps, storyContent, type Source, type Step } from "../storyDraft";

const STEP_NAMES: Record<Step, string> = { elements: "Elements", snippet: "Snippet", style: "Style" };

/** Full-screen "Share to Story" flow: a live story preview over a stepped sheet. Opened from the album screen. */
export default function ShareStory() {
  const { discogsId, reviewId } = useLocalSearchParams<{ discogsId: string; reviewId?: string }>();
  const { data } = useAlbumDetails(discogsId);
  const viewer = useSession()?.username ?? "";
  const [draft, setDraft] = useState(initialDraft);
  const insets = useSafeAreaInsets();

  if (!data) return <ActivityIndicator style={{ flex: 1 }} />;
  const review = reviewId ? data.reviews.find((r) => String(r.id) === reviewId) : undefined;
  if (reviewId && !review) return <Text style={{ flex: 1, textAlign: "center", marginTop: 96 }}>Review not found</Text>;
  const source: Source = review ? { album: data.album, review } : { album: data.album, rating: data.average_rating ?? undefined };

  const c = storyContent(source, draft, viewer);
  const { genre, variant } = activeStyle(source, draft);
  const { index, step } = currentStep(source, draft);
  const all = steps(source, draft);
  const blocked = nextBlocked(source, draft);
  const kind = !review ? "Album" : elements(source).includes("body") ? "Full review" : "Short take";
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

      <Preview>
        <Story c={c} genre={genre} variant={variant} />
      </Preview>

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
          {step === "style" && <StyleStep source={source} draft={draft} setDraft={setDraft} c={c} plus={false} />}
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
        </View>
      </View>
    </View>
  );
}

/** Scales the 360×640 story to fit the space above the sheet, with the design's rounded frame. */
function Preview({ children }: { children: ReactNode }) {
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
        </View>
      )}
    </View>
  );
}
