import type { User } from "@halfnote/data";
import { useUser } from "@halfnote/data/react";
import { Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { BG, INK } from "../../components";
import { OFFLINE, TextButton } from "../../features/onboarding/bits";
import { OnboardingContext, type Answers } from "../../features/onboarding/context";
import { fromGrid, isPlaceholder, suggestHandle } from "../../features/onboarding/model";
import { logout } from "../../lib/session";
import { F } from "../../features/story/kit";

export default function OnboardingLayout() {
  const user = useUser();
  if (user.data) return <Flow user={user.data} />;
  return (
    <View style={s.waiting}>
      {user.isError ? (
        <>
          <Text style={s.message}>{OFFLINE}</Text>
          <TextButton label="Try again" onPress={() => void user.refetch()} />
          <TextButton label="Log out" onPress={() => void logout()} />
        </>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}

function Flow({ user }: { user: User }) {
  const [answers, setAnswers] = useState<Answers>(() => {
    const fresh = isPlaceholder(user.username);
    const name = user.name ?? "";
    const picks = user.favorite_albums.map(fromGrid);
    return {
      name,
      handle: fresh ? suggestHandle(name) : user.username,
      handleTouched: !fresh,
      picks,
      savedPicks: picks,
      face: user.avatar_preset ?? "cat",
    };
  });
  return (
    <OnboardingContext value={{ answers, update: (change) => setAnswers((a) => ({ ...a, ...change })) }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Declared screens come first, and the stack opens on the first one. */}
        <Stack.Screen name="index" />
        <Stack.Screen name="done" options={{ gestureEnabled: false, animation: "fade" }} />
      </Stack>
    </OnboardingContext>
  );
}

const s = StyleSheet.create({
  waiting: { flex: 1, backgroundColor: BG, alignItems: "center", justifyContent: "center", padding: 24, gap: 4 },
  message: { fontFamily: F.sans, fontSize: 15, lineHeight: 21, textAlign: "center", color: INK },
});
