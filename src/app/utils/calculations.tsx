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

type RatingStampOptions = {
  empty?: boolean;
  outTen?: boolean;
};

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

const ratingBadgeMap: Record<number, StaticImageData> = {
  1: Icons.oneStamp,
  2: Icons.twoStamp,
  3: Icons.threeStamp,
  4: Icons.fourStamp,
  5: Icons.fiveStamp,
  6: Icons.sixStamp,
  7: Icons.sevenStamp,
  8: Icons.eightStamp,
  9: Icons.nineStamp,
  10: Icons.tenStamp,
};

const ratingOutTenBadgeMap: Record<number, StaticImageData> = {
  1: Icons.oneOutTen,
  2: Icons.twoOutTen,
  3: Icons.threeOutTen,
  4: Icons.fourOutTen,
  5: Icons.fiveOutTen,
  6: Icons.sixOutTen,
  7: Icons.sevenOutTen,
  8: Icons.eightOutTen,
  9: Icons.nineOutTen,
  10: Icons.tenOutTen,
};

const emptyRatingBadgeMap: Record<number, StaticImageData> = {
  1: Icons.oneEmptyStamp,
  2: Icons.twoEmptyStamp,
  3: Icons.threeEmptyStamp,
  4: Icons.fourEmptyStamp,
  5: Icons.fiveEmptyStamp,
  6: Icons.sixEmptyStamp,
  7: Icons.sevenEmptyStamp,
  8: Icons.eightEmptyStamp,
  9: Icons.nineEmptyStamp,
  10: Icons.tenEmptyStamp,
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

export function generateRatingStamp(
  rating: number,
  { empty = true, outTen = false }: RatingStampOptions = {}
) {
  if (empty) {
    return emptyRatingBadgeMap[rating];
  }
  if (outTen) {
    return ratingOutTenBadgeMap[rating];
  }
  return ratingBadgeMap[rating];
}
export const getTimeAgo = (time: string) => {
  const now = new Date();
  const past = new Date(time);
  const diffInMs = now.getTime() - past.getTime();

  // Convert to different time units
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  // Return appropriate time format
  if (diffInSeconds < 60) {
    return diffInSeconds <= 1 ? "just now" : `${diffInSeconds}s ago`;
  } else if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 min ago" : `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  } else if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
  } else if (diffInMonths < 12) {
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  } else {
    return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
  }
};
