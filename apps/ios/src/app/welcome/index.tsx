import { useOnboardingAlbums } from "@halfnote/data/react";
import { router } from "expo-router";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { BG, INK } from "../../components";
import { LOGO } from "../../svg/logo";
import { PrimaryButton, TextButton } from "../../features/onboarding/bits";
import { Art, F, font } from "../../features/story/kit";

/** The design's wall on a 390-point-wide screen: left, top, size, tilt. */
const WALL = [
  [18, 40, 118, -6],
  [150, 22, 96, 4],
  [262, 58, 112, 7],
  [-20, 176, 104, 5],
  [96, 150, 132, -3],
  [244, 190, 120, -5],
  [30, 300, 96, 8],
  [140, 300, 114, 3],
  [266, 320, 104, -7],
  [-30, 430, 90, -4],
  [110, 440, 80, 6],
  [300, 450, 90, 2],
];

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const scale = useWindowDimensions().width / 390;
  const albums = useOnboardingAlbums().data?.albums ?? [];
  return (
    <View style={s.screen}>
      <View aria-hidden style={s.wall}>
        {WALL.map(([left, top, size, tilt], i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: left * scale,
              top: top * scale,
              transform: [{ rotate: `${tilt}deg` }],
              borderRadius: 3,
              boxShadow: "0 18px 28px -18px rgba(0,0,0,0.55)",
            }}
          >
            <Art uri={albums[i]?.cover_url ?? undefined} style={{ width: size * scale, height: size * scale, borderRadius: 3, backgroundColor: "#DADADA" }} />
          </View>
        ))}
      </View>
      <View style={[s.copy, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View accessible accessibilityRole="image" accessibilityLabel="halfnote" style={s.logo}>
          <SvgXml xml={LOGO} width={84} height={30} />
        </View>
        <Text role="heading" style={[font(F.serif, 40, 1), s.title]}>
          Say what you heard
        </Text>
        <Text style={s.body}>Rate albums, write a line or a whole review, and see what your friends are playing.</Text>
        <View style={s.buttons}>
          <PrimaryButton label="Get started" onPress={() => router.push({ pathname: "/welcome/sign-in", params: { mode: "create" } })} />
          <TextButton label="I already have an account" onPress={() => router.push("/welcome/sign-in")} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  wall: { flex: 1, overflow: "hidden" },
  copy: { paddingTop: 24, paddingHorizontal: 24, gap: 12 },
  logo: { alignSelf: "flex-start" },
  title: { color: INK },
  body: { fontFamily: F.sans, fontSize: 16, lineHeight: 23, color: "#444" },
  buttons: { marginTop: 14, gap: 12 },
});
