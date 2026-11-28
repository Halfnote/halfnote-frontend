import { AVATAR_PRESETS, ApiError, type AvatarPreset } from "@halfnote/data";
import { useSaveProfile } from "@halfnote/data/react";
import { router } from "expo-router";
import { use } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { BG, INK } from "../../components";
import { FACES } from "../../svg/faces";
import { FieldError, Frame, Heading, OFFLINE, PrimaryButton } from "../../features/onboarding/bits";
import { OnboardingContext } from "../../features/onboarding/context";
import { storeOnboarded } from "../../lib/session";
import { F } from "../../features/story/kit";
import { Pulse } from "../../features/write/motion";

const nameOf = (face: AvatarPreset) => face[0].toUpperCase() + face.slice(1);

export default function Face() {
  const { answers, update } = use(OnboardingContext);
  const { face } = answers;
  const save = useSaveProfile();

  const finish = () =>
    save.mutate(
      { avatarPreset: face, onboarded: true },
      {
        onSuccess: async () => {
          await storeOnboarded();
          router.replace("/onboarding/done");
        },
      },
    );

  let error: string | undefined;
  if (save.isError) error = save.error instanceof ApiError ? save.error.message : OFFLINE;

  return (
    <Frame
      step={3}
      footer={
        <>
          <FieldError text={error} />
          <PrimaryButton label="Finish" onPress={finish} pending={save.isPending} />
        </>
      }
    >
      <View>
        <Heading>Pick a face</Heading>
        <Text style={s.intro}>This is you next to every review. You can change it later.</Text>
      </View>
      <View style={s.preview}>
        <Pulse key={face}>
          <SvgXml xml={FACES[face]} width={132} height={132} />
        </Pulse>
        <Text style={s.name}>{nameOf(face)}</Text>
      </View>
      <View style={s.grid}>
        {AVATAR_PRESETS.map((key) => (
          <View key={key} style={s.cell}>
            <Pressable role="button" aria-selected={key === face} accessibilityLabel={nameOf(key)} disabled={save.isPending} onPress={() => update({ face: key })} style={[s.face, key === face && s.faceOn]}>
              <SvgXml xml={FACES[key]} width={68} height={68} />
            </Pressable>
          </View>
        ))}
      </View>
    </Frame>
  );
}

const s = StyleSheet.create({
  intro: { marginTop: 10, fontFamily: F.sans, fontSize: 14, lineHeight: 20, color: "#555" },
  preview: { marginTop: 12, marginBottom: 14, alignItems: "center", gap: 10 },
  name: { fontFamily: F.sans, fontSize: 14, color: "#444" },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 14 },
  cell: { width: "25%", alignItems: "center" },
  face: { width: 68, height: 68, borderRadius: 34 },
  faceOn: { boxShadow: `0 0 0 3px ${BG}, 0 0 0 5px ${INK}` },
});
