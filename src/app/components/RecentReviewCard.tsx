import React from "react";
import Image, { StaticImageData } from "next/image";

import { Icons } from "../icons/icons";
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
type RecentReviewCardProps = {
  albumCover: StaticImageData;
  rating: number;
  genre: string;
  time: number;
};

export const RecentReviewCard = ({
  albumCover,
  rating,
  time,
  genre,
}: RecentReviewCardProps) => {
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
    <div className="flex flex-row gap-2 w-[212px] items-center relative mb-4">
      <Image
        src={albumCover}
        alt="Top Album"
        className="w-[90px] h-[90px] object-cover rounded-md object-center"
      />

      {/* Container to center the badge */}
      <div className="relative w-[90px] h-[90px] flex items-center justify-center">
        <div className="w-[80px] absolute flex items-center justify-center">
          {getBadgeComponent(genre, rating)}
        </div>
      </div>

      <div className="another-heading4 text-[#767676]">{time}m</div>
    </div>
  );
};
