import type { Person } from "@halfnote/data";
import { Image, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { BG } from "./theme";

/** A photo, or the board's 5×5 mirrored pixel face seeded by the handle on the album's label colour. */
export function Avatar({ person, color, size }: { person: Person; color: string; size: number }) {
  if (person.avatar) return <Image source={{ uri: person.avatar }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  let h = 2166136261;
  for (let k = 0; k < person.username.length; k++) h = Math.imul(h ^ person.username.charCodeAt(k), 16777619) >>> 0;
  const cells = [];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++) if ((h >> (r * 3 + (c < 3 ? c : 4 - c))) & 1) cells.push(<Rect key={r * 5 + c} x={c * 4} y={r * 4} width={4} height={4} fill={BG} />);
  const face = Math.round(size * 0.58);
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
      <Svg width={face} height={face} viewBox="0 0 20 20">
        {cells}
      </Svg>
    </View>
  );
}
