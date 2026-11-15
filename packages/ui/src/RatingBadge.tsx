import Svg, { Line, Path, Text } from "react-native-svg";

const HEXAGON =
  "M50,5 C52,5 55,6 56.7,7.3 L87,27.5 C88.7,28.8 90,31.5 90,33.5 V66.5 C90,68.5 88.7,71.2 87,72.5 L56.7,92.7 C55,94 52,95 50,95 C48,95 45,94 43.3,92.7 L13,72.5 C11.3,71.2 10,68.5 10,66.5 V33.5 C10,31.5 11.3,28.8 13,27.5 L43.3,7.3 C45,6 48,5 50,5 Z";
const FONT = "'EB Garamond', Georgia, serif";

export function RatingBadge({ rating }: { rating: number | string }) {
  return (
    <Svg width={66} height={66} viewBox="0 0 100 100">
      <Path d={HEXAGON} fill="white" stroke="black" strokeWidth={2.5} />
      <Text x={33} y={64} textAnchor="middle" fontSize={48} fontFamily={FONT} fontWeight={550}>
        {rating}
      </Text>
      <Line x1={53} y1={30} x2={53} y2={72} stroke="black" strokeWidth={2} transform="rotate(12 50 50)" />
      <Text x={70} y={64} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={400}>
        10
      </Text>
    </Svg>
  );
}
