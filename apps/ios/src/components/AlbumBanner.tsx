import { View } from "react-native";
import { Art } from "../story/kit";

/** A profile's four favourite albums; empty spots stay grey. */
export function AlbumBanner({ covers }: { covers: (string | null | undefined)[] }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {[0, 1, 2, 3].map((i) => (
        <Art key={i} uri={covers[i] ?? undefined} style={{ width: "25%", aspectRatio: 1, backgroundColor: "#DADADA" }} />
      ))}
    </View>
  );
}
