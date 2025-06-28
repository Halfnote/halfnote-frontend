import React from "react";
import { StaticImageData } from "next/image";
import classicalStamp from "@/app/icons/genre_stamp/CLASSICAL-genreTag_container.svg";
import countryStamp from "@/app/icons/genre_stamp/COUNTRY-genreTag_container.svg";
import electronicStamp from "@/app/icons/genre_stamp/ELECTRONIC-genreTag_container.svg";
import folkStamp from "@/app/icons/genre_stamp/FOLK-genreTag_container.svg";
import funkStamp from "@/app/icons/genre_stamp/FUNK-genreTag_container.svg";
import gospelStamp from "@/app/icons/genre_stamp/GOSPEL-genreTag_container.svg";
import hiphopStamp from "@/app/icons/genre_stamp/HIPHOP-genreTag_container.svg";
import jazzStamp from "@/app/icons/genre_stamp/JAZZ-genreTag_container.svg";
import latinStamp from "@/app/icons/genre_stamp/LATIN-genreTag_container.svg";
import popStamp from "@/app/icons/genre_stamp/POP-genreTag_container.svg";
import reggaeStamp from "@/app/icons/genre_stamp/REGGAE-genreTag_container.svg";
import rockStamp from "@/app/icons/genre_stamp/ROCK-genreTag_container.svg";
import { Icons } from "../icons/icons";
import * as Stamps from "@/app/icons/stamps";

// import {
//   ClassicalBadge,
//   CountryBadge,
//   ElectronicBadge,
//   FolkBadge,
//   FunkBadge,
//   GospelBadge,
//   HipHopBadge,
//   JazzBadge,
//   LatinBadge,
//   PopBadge,
//   ReggaeBadge,
//   RockBadge,
// } from "@/app/icons/stamps";

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

type GenreBadgeProps = {
  genre: string;
};

const genreBadgeMap: Record<string, string> = {
  Classical: "ClassicalBadge",
  Country: "CountryBadge",
  Electronic: "ElectronicBadge",
  Folk: "FolkBadge",
  Funk: "FunkBadge",
  Gospel: "GospelBadge",
  Hiphop: "HipHopBadge",
  Jazz: "JazzBadge",
  Latin: "LatinBadge",
  Pop: "PopBadge",
  Reggae: "ReggaeBadge",
  Rock: "RockBadge",
};

const genreStampMap: Record<string, StaticImageData> = {
  Classical: classicalStamp,
  Country: countryStamp,
  Electronic: electronicStamp,
  Folk: folkStamp,
  Funk: funkStamp,
  Gospel: gospelStamp,
  Hiphop: hiphopStamp,
  Jazz: jazzStamp,
  Latin: latinStamp,
  Pop: popStamp,
  Reggae: reggaeStamp,
  Rock: rockStamp,
};

export const generateBadge = (genre: string) => {
  return genreStampMap[genre];
};
export function genreBadge({
  genre,
  rating,
}: {
  genre: string;
  rating: number;
}) {
  const badgeName = genreBadgeMap[genre];
  const BadgeComponent = badgeName
    ? (Stamps[badgeName as keyof typeof Stamps] as React.ComponentType<{
        number: number | string;
      }>)
    : null;

  return BadgeComponent
    ? React.createElement(BadgeComponent, { number: rating })
    : null;
}
