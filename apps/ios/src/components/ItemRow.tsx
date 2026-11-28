import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { F, font } from "../features/story/kit";
import { Stamp } from "./Stamp";
import { INK, SUB } from "./theme";

interface ItemRowProps {
  lead: ReactNode;
  title: string;
  subtitle: string;
  rating: number | null;
  stampSize?: number;
  /** A person's row: small sans name instead of the serif album title. */
  person?: boolean;
  onPress?: () => void;
}

export function ItemRow({ lead, title, subtitle, rating, stampSize = 40, person, onPress }: ItemRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={`${title}, ${subtitle}${rating ? `, rated ${rating} out of 10` : ""}`}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: person ? 10 : 12, transform: [{ scale: pressed ? 0.98 : 1 }] })}
    >
      {lead}
      <View style={{ flex: 1, minWidth: 0, gap: person ? 1 : 3 }}>
        <Text numberOfLines={2} style={person ? { fontFamily: F.sans600, fontSize: 14, color: INK } : [font(F.serif, 21, 1), { color: INK }]}>
          {title}
        </Text>
        <Text numberOfLines={1} style={{ fontFamily: F.sans, fontSize: 12, color: SUB }}>
          {subtitle}
        </Text>
      </View>
      <Stamp rating={rating} size={stampSize} />
    </Pressable>
  );
}

export function ReviewRow({ text, onPress, ...row }: Omit<ItemRowProps, "onPress" | "stampSize"> & { text: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({ padding: 14, borderRadius: 14, backgroundColor: "#FFFFFF", gap: 10, transform: [{ scale: pressed ? 0.98 : 1 }] })}
    >
      <ItemRow {...row} />
      {text !== "" && <Text style={[font(F.serif, 20, 1.15), { color: INK }]}>{text}</Text>}
    </Pressable>
  );
}
