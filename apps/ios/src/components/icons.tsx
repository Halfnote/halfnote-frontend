import Svg, { Path, Rect } from "react-native-svg";
import { INK } from "./theme";

const HEART = "M6.5 11 C2 7.6 0.8 5.8 0.8 3.8 A2.8 2.8 0 0 1 6.5 2.6 A2.8 2.8 0 0 1 12.2 3.8 C12.2 5.8 11 7.6 6.5 11 Z";

export const Heart = ({ on, size = 15 }: { on?: boolean; size?: number }) => (
  <Svg width={size + 1} height={size} viewBox="0 0 13 12">
    <Path d={HEART} fill={on ? INK : "none"} stroke={on ? INK : "#555"} strokeWidth={1.2} />
  </Svg>
);

export const PixelBack = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    {[[3, 11, 19], [5, 9], [5, 13], [7, 7], [7, 15], [9, 5], [9, 17]].map(([x, y, w = 2]) => (
      <Rect key={`${x},${y}`} x={x} y={y} width={w} height={2} fill={INK} />
    ))}
  </Svg>
);
