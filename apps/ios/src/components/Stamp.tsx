import { SvgXml } from "react-native-svg";
import { STAMPS_ON } from "../svg/ratingStamps";

export function Stamp({ rating, size }: { rating: number | null; size: number }) {
  if (rating == null) return null;
  return <SvgXml xml={STAMPS_ON[rating - 1]} width={size} height={size} />;
}
