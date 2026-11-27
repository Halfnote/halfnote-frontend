import { ApiError } from "@halfnote/data";
import { useDebounce, useSaveProfile, useUsernameAvailable } from "@halfnote/data/react";
import { router } from "expo-router";
import { use, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SUB } from "../../components";
import { ERROR, Field, FieldError, Frame, Heading, OFFLINE, OK, PrimaryButton } from "../../onboarding/bits";
import { OnboardingContext } from "../../onboarding/context";
import { cleanHandle, suggestHandle, validHandle } from "../../onboarding/model";
import { logout, setUsername } from "../../session";
import { F } from "../../story/kit";

const TAKEN = { text: "Taken", color: ERROR };

export default function You() {
  const { answers, update } = use(OnboardingContext);
  const { name, handle, handleTouched } = answers;
  const save = useSaveProfile();
  /** A name someone else claimed after the live check passed. */
  const [lost, setLost] = useState("");

  const valid = validHandle(handle);
  const settled = useDebounce(handle, 400);
  const check = useUsernameAvailable(valid && settled === handle ? handle : "").data;
  const checked = valid && settled === handle ? check : undefined;

  let note;
  if (handle && !valid) note = { text: "2–24 letters, numbers, . or _", color: ERROR };
  else if (handle && handle === lost) note = TAKEN;
  else if (checked?.available) note = { text: "Available", color: OK };
  else if (checked) note = checked.error === "taken" ? TAKEN : { text: "Not available", color: ERROR };

  const ready = !!name.trim() && valid && handle !== lost && checked?.available !== false;

  let error: string | undefined;
  if (save.error instanceof ApiError) error = save.error.fields.username ? undefined : save.error.message;
  else if (save.isError) error = OFFLINE;

  const submit = () => {
    if (!ready || save.isPending) return;
    save.mutate(
      { name: name.trim(), username: handle },
      {
        onSuccess: async (user) => {
          await setUsername(user.username);
          router.push("/onboarding/albums");
        },
        onError: (e) => {
          if (e instanceof ApiError && e.fields.username) setLost(handle);
        },
      },
    );
  };

  return (
    <Frame step={1} onBack={() => void logout()} footer={<PrimaryButton label="Continue" onPress={submit} disabled={!ready} pending={save.isPending} />}>
      <View style={s.heading}>
        <Heading>{"What should\nwe call you?"}</Heading>
      </View>
      <Field
        label="Name"
        placeholder="Your name"
        value={name}
        onChangeText={(text) => update(handleTouched ? { name: text } : { name: text, handle: suggestHandle(text) })}
        editable={!save.isPending}
        maxLength={100}
        autoCorrect={false}
        textContentType="name"
        style={s.name}
        testID="name"
      />
      <Field
        label="Username"
        placeholder="username"
        prefix="@"
        note={note}
        value={handle}
        onChangeText={(text) => update({ handle: cleanHandle(text), handleTouched: true })}
        editable={!save.isPending}
        maxLength={24}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        returnKeyType="done"
        onSubmitEditing={submit}
        testID="handle"
      />
      <FieldError text={error} />
      <Text style={s.later}>You can change both later.</Text>
    </Frame>
  );
}

const s = StyleSheet.create({
  heading: { marginBottom: 8 },
  name: { fontFamily: F.serif, fontSize: 26 },
  later: { marginTop: 4, fontFamily: F.sans, fontSize: 13, lineHeight: 19, color: SUB },
});
