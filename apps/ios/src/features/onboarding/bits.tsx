import { router } from "expo-router";
import { useState, type ReactNode } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BG, INK, PixelBack, SUB } from "../../components";
import { F, font } from "../story/kit";

export const ERROR = "#B3261E";
export const OK = "#2F6B3A";
export const OFFLINE = "Couldn't reach halfnote. Check your connection and try again.";

export const Heading = ({ children }: { children: string }) => (
  <Text role="heading" style={[font(F.serif, 36, 1), { color: INK }]}>
    {children}
  </Text>
);

export function PrimaryButton({ label, onPress, disabled, pending }: { label: string; onPress: () => void; disabled?: boolean; pending?: boolean }) {
  const off = disabled || pending;
  return (
    <Pressable
      role="button"
      aria-label={label}
      aria-disabled={off}
      aria-busy={pending}
      disabled={off}
      onPress={onPress}
      style={({ pressed }) => [s.primary, disabled && s.primaryOff, pressed && s.pressed]}
    >
      {pending ? <ActivityIndicator color={BG} /> : <Text style={[s.primaryText, disabled && s.primaryTextOff]}>{label}</Text>}
    </Pressable>
  );
}

export function TextButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable role="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [s.textButton, pressed && s.pressed]}>
      <Text style={s.textButtonText}>{label}</Text>
    </Pressable>
  );
}

interface FieldProps extends TextInputProps {
  label: string;
  note?: { text: string; color: string };
  error?: string;
  prefix?: string;
}

export function Field({ label, note, error, prefix, style, ...input }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.fieldWrap}>
      <View style={[s.field, focused && s.fieldFocused]}>
        <View style={s.fieldTop}>
          <Text style={s.label}>{label}</Text>
          {note ? (
            <Text aria-live="polite" style={[s.note, { color: note.color }]}>
              {note.text}
            </Text>
          ) : null}
        </View>
        <View style={s.fieldRow}>
          {prefix ? <Text style={s.prefix}>{prefix}</Text> : null}
          <TextInput
            {...input}
            accessibilityLabel={label}
            placeholderTextColor="#8A8A8A"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={[s.input, style]}
          />
        </View>
      </View>
      <FieldError text={error} />
    </View>
  );
}

export const FieldError = ({ text }: { text?: string }) =>
  text ? (
    <Text aria-live="polite" style={s.error}>
      {text}
    </Text>
  ) : null;

interface FrameProps {
  /** 1 to 3 draws the progress bars. */
  step?: number;
  onBack?: () => void;
  footer: ReactNode;
  children: ReactNode;
}

/** Back arrow and progress on top, scrolling content, and buttons pinned above the keyboard. */
export function Frame({ step, onBack = () => router.back(), footer, children }: FrameProps) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView behavior="padding" style={[s.screen, { paddingTop: insets.top }]}>
      <View style={s.bar}>
        <Pressable onPress={onBack} role="button" accessibilityLabel="Back" style={s.back}>
          <PixelBack />
        </Pressable>
        {step ? (
          <View role="progressbar" accessibilityLabel="Setup progress" accessibilityValue={{ min: 1, max: 3, now: step }} style={s.bars}>
            {[1, 2, 3].map((n) => (
              <View key={n} style={[s.barPart, n <= step && s.barOn]} />
            ))}
          </View>
        ) : null}
      </View>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        {children}
      </ScrollView>
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>{footer}</View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  bar: { height: 60, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  bars: { flex: 1, flexDirection: "row", gap: 4, marginRight: 44 },
  barPart: { flex: 1, height: 3, borderRadius: 2, backgroundColor: "#D2D2D2" },
  barOn: { backgroundColor: "#1d1d1d" },
  scroll: { flex: 1 },
  content: { paddingTop: 8, paddingHorizontal: 24, paddingBottom: 24, gap: 12 },
  footer: { paddingTop: 12, paddingHorizontal: 24, gap: 6 },
  primary: { minHeight: 52, borderRadius: 12, backgroundColor: "#1d1d1d", alignItems: "center", justifyContent: "center" },
  primaryOff: { backgroundColor: "#DCDCDC" },
  primaryText: { fontFamily: F.sans600, fontSize: 16, color: BG },
  primaryTextOff: { color: "#8A8A8A" },
  pressed: { transform: [{ scale: 0.97 }] },
  textButton: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  textButtonText: { fontFamily: F.sans, fontSize: 15, color: INK },
  fieldWrap: { gap: 6 },
  field: { paddingTop: 10, paddingHorizontal: 14, paddingBottom: 12, borderRadius: 14, backgroundColor: "#FFFFFF", gap: 3 },
  fieldFocused: { boxShadow: "0 0 0 2px #111" },
  fieldTop: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  fieldRow: { flexDirection: "row", alignItems: "center", gap: 1 },
  label: { fontFamily: F.sans, fontSize: 12, color: SUB },
  note: { fontFamily: F.sans, fontSize: 12 },
  prefix: { fontFamily: F.sans, fontSize: 17, color: SUB },
  input: { flex: 1, minWidth: 0, padding: 0, fontFamily: F.sans, fontSize: 17, color: INK },
  error: { paddingHorizontal: 14, fontFamily: F.sans, fontSize: 13, lineHeight: 18, color: ERROR },
});
