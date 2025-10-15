import React from "react";
import Image, { StaticImageData } from "next/image";
import {
  ClassicalBadge,
  CountryBadge,
  ElectronicBadge,
  FolkBadge,
  FunkBadge,
  GospelBadge,
  HipHopBadge,
  JazzBadge,
  LatinBadge,
  PopBadge,
  ReggaeBadge,
  RockBadge,
} from "../icons/stamps";
type RecentReviewProps = {
  albumCover: StaticImageData;
  rating: number;
  genre: string;
  time: number;
};

export const RecentReview = ({
  albumCover,
  rating,
  time,
  genre,
}: RecentReviewProps) => {
  const getBadgeComponent = (genre: string, number: number) => {
    const badges: Record<string, React.FC<{ number: number }>> = {
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

    const BadgeComponent = badges[genre];
    return BadgeComponent ? <BadgeComponent number={number} /> : null;
  };
  return (
    <div className="flex flex-row gap-2 w-full items-center relative mb-2">
      <Image
        src={albumCover}
        alt="Top Album"
        className="relative aspect-square w-2/5 h-auto object-cover rounded-md object-center"
      />

      <div className="relative aspect-square w-2/5 h-auto flex items-center justify-center">
        <div className="w-full absolute flex items-center justify-center">
          {getBadgeComponent(genre, rating)}
        </div>
      </div>

      <div className="another-heading4 text-[#767676]">{time}m</div>
    </div>
  );
};
