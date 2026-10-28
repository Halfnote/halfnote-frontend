import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { elements, elementsNote, type Draft, type Element, type Source } from "../storyDraft";
import { F, font } from "./kit";

export const INK = "#111111";
export const FILL = "#1d1d1d";
export const MUTED = "#555555";

const TOGGLES: Record<Element, [label: string, icon: string]> = {
  art: ["Art", "M3 3h14v14H3z M3 13l4-4 3 3 3-3 4 4"],
  head: ["Headline", "M4 4h12 M10 4v12"],
  body: ["Review", "M3 5h14 M3 9h14 M3 13h9"],
  artist: ["Album", "M10 2.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 1 0 0-15z M10 8a2 2 0 1 0 0 4a2 2 0 1 0 0-4z"],
  rating: ["Rating", "M10 2.8l2.2 4.4 4.8.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8L3 7.9l4.8-.7z"],
};

export const Heading = ({ children }: { children: string }) => <Text style={[font(F.serif, 26, 1), { color: INK }]}>{children}</Text>;

type StepProps = { source: Source; draft: Draft; setDraft: (f: (d: Draft) => Draft) => void };

export function ElementsStep({ source, draft, setDraft }: StepProps) {
  return (
    <View style={{ gap: 10 }}>
      <Heading>What goes on it</Heading>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {elements(source).map((k) => {
          const on = draft.show[k];
          const [label, d] = TOGGLES[k];
          return (
            <Pressable
              key={k}
              onPress={() => setDraft((x) => ({ ...x, show: { ...x.show, [k]: !x.show[k] } }))}
              accessibilityRole="switch"
              accessibilityLabel={label}
              accessibilityState={{ checked: on }}
              style={{
                flex: 1,
                height: 58,
                borderRadius: 10,
                backgroundColor: on ? FILL : "rgba(17,17,17,0.06)",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                stroke={on ? "#EEEEEE" : MUTED}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d={d} />
              </Svg>
              <Text style={[font(F.sans500, 11), { color: on ? "#EEEEEE" : MUTED }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={[font(F.sans, 13, 1.45), { color: MUTED }]}>{elementsNote(source, draft)}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  disabled,
  onPress,
  icon,
  trail,
}: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
  icon?: ReactNode;
  trail?: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={{
        flex: 1,
        minHeight: 48,
        borderRadius: 999,
        backgroundColor: FILL,
        opacity: disabled ? 0.35 : 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {icon}
      <Text style={[font(F.sans500, 14), { color: "#EEEEEE" }]}>{label}</Text>
      {trail}
    </Pressable>
  );
}
