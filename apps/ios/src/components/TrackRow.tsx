import { Text, View } from "react-native";
import { F } from "../features/story/kit";
import { BG, INK } from "./theme";

/** A tracklist row as the board draws it; the favourite is inverted. */
export function TrackRow({ position, title, length, on }: { position: string; title: string; length: string; on: boolean }) {
  const color = on ? BG : INK;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", minHeight: 40, paddingHorizontal: 10, borderRadius: 8, backgroundColor: on ? "#1d1d1d" : "transparent" }}>
      <Text style={{ width: 28, fontFamily: F.sans, fontSize: 12, color, opacity: 0.6 }}>{position}</Text>
      <Text style={{ flex: 1, fontFamily: F.sans, fontSize: 15, color }}>{title}</Text>
      <Text style={{ width: 44, textAlign: "right", fontFamily: F.sans, fontSize: 12, color, opacity: 0.6 }}>{length}</Text>
    </View>
  );
}
