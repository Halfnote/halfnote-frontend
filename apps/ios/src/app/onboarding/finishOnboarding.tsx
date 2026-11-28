import { router } from "expo-router";
import { use } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { AlbumBanner, BG, INK, SUB } from "../../components";
import { FACES } from "../../svg/faces";
import { PrimaryButton, TextButton } from "../../features/onboarding/bits";
import { OnboardingContext } from "../../features/onboarding/context";
import { leaveOnboarding } from "../../lib/session";
import { F, font } from "../../features/story/kit";
import { Pop, Rise } from "../../features/write/motion";

async function leave(write: boolean) {
  await leaveOnboarding();
  // The root layout unlocks these routes when it re-renders with the new session.
  setTimeout(() => {
    router.replace("/activity");
    if (write) router.push("/write");
  }, 0);
}

export default function Done() {
  const insets = useSafeAreaInsets();
  const { name, handle, picks, face } = use(OnboardingContext).answers;
  return (
    <View style={s.screen}>
      <Rise delay={0}>
        <AlbumBanner covers={picks.map((p) => p.cover)} />
      </Rise>
      <View style={s.who}>
        <Pop delay={260} style={s.face}>
          <SvgXml xml={FACES[face]} width={84} height={84} />
        </Pop>
        <Rise delay={340} style={s.names}>
          <Text style={[font(F.serif, 34, 1), s.ink]}>{name.trim()}</Text>
          <Text style={s.handle}>@{handle}</Text>
        </Rise>
      </View>
      <Rise delay={420} style={[s.bottom, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Text role="heading" style={[font(F.serif, 40, 1), s.ink]}>
          {"You're in"}
        </Text>
        <Text style={s.note}>{picks.length > 0 ? "Your banner and face are set." : "Your face is set."} Start with something you played this week.</Text>
        <PrimaryButton label="Write your first review" onPress={() => void leave(true)} />
        <TextButton label="Go to Activity" onPress={() => void leave(false)} />
      </Rise>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  who: { marginTop: -40, paddingHorizontal: 24, gap: 10, alignItems: "flex-start" },
  face: { padding: 4, borderRadius: 46, backgroundColor: BG },
  names: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", columnGap: 8 },
  ink: { color: INK },
  handle: { fontFamily: F.sans, fontSize: 13, color: SUB },
  bottom: { flex: 1, paddingHorizontal: 24, justifyContent: "flex-end", gap: 10 },
  note: { marginBottom: 12, fontFamily: F.sans, fontSize: 15, lineHeight: 22, color: "#444" },
});
