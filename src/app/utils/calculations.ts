import { Icons } from "../icons/icons";
type GenreBadgeProps = {
  genre: string;
  number: number | string;
};

import React from "react";
import {
  PopBadge,
  ClassicalBadge,
  CountryBadge,
  ElectronicBadge,
  FolkBadge,
  FunkBadge,
  GospelBadge,
  HipHopBadge,
  JazzBadge,
  LatinBadge,
  ReggaeBadge,
  RockBadge,
} from "../icons/stamps";

export const getVinylIcon = (reviewCount: number = 0) => {
  if (reviewCount >= 1500) {
    return Icons.fifthVinyl;
  } else if (reviewCount >= 500) {
    return Icons.fourthVinyl;
  } else if (reviewCount >= 100) {
    return Icons.thirdVinyl;
  } else if (reviewCount >= 1) {
    return Icons.secondVinyl;
  } else {
    return Icons.firstVinyl;
  }
};

export const GenreBadge = ({ genre, number }: GenreBadgeProps) => {
  const genreMap: {
    [key: string]: React.ComponentType<{ number: number | string }>;
  } = {
    Pop: PopBadge,
    Classical: ClassicalBadge,
    Country: CountryBadge,
    Electronic: ElectronicBadge,
    Folk: FolkBadge,
    Funk: FunkBadge,
    Gospel: GospelBadge,
    HipHop: HipHopBadge,
    Jazz: JazzBadge,
    Latin: LatinBadge,
    Reggae: ReggaeBadge,
    Rock: RockBadge,
  };

  const BadgeComponent = genreMap[genre] || PopBadge; // Default to PopBadge if genre not found

  return React.createElement(BadgeComponent, { number });
};
