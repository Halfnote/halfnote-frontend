import React from "react";
import Image, { StaticImageData } from "next/image";
import writingIconSrc from "../icons/miscellaneous/Writing_Icon.svg";
import {
  ClassicalBadge, CountryBadge, ElectronicBadge, FolkBadge,
  FunkBadge, GospelBadge, HipHopBadge, JazzBadge,
  LatinBadge, PopBadge, ReggaeBadge, RockBadge,
} from "../icons/stamps";

export type ActivityReviewCardProps = {
  albumCover: StaticImageData | string;
  albumTitle: string;
  artistName: string;
  rating: number;
  genre: string;
  profilePic: StaticImageData | string;
  displayName: string;
  userName: string;
  time: string;
  hasReview: boolean;
};

export const ActivityReviewCard: React.FC<ActivityReviewCardProps> = ({
  albumCover,
  albumTitle,
  artistName,
  rating,
  genre,
  profilePic,
  displayName,
  userName,
  time,
  hasReview,
}) => {
  const mapBadges: Record<string, React.FC<{ number: number }>> = {
    Pop: PopBadge, Rock: RockBadge, Jazz: JazzBadge,
    Folk: FolkBadge, Country: CountryBadge, Electronic: ElectronicBadge,
    Funk: FunkBadge, Gospel: GospelBadge, HipHop: HipHopBadge,
    Latin: LatinBadge, Reggae: ReggaeBadge, Classical: ClassicalBadge,
  };
  const Badge = mapBadges[genre];

  return (
    <div
      className="
        flex items-center
        w-full max-w-[1682px]      
        h-[120px]                 
        border-[1.5px] border-black
        rounded-[24px]
        bg-white
        p-[16px] mb-[16px]
      "
    >
      {/* 1) Album art: fixed 60×60 in Figma */}
      <div className="flex-shrink-0 w-[60px] h-[60px]">
        <Image
          src={albumCover}
          alt={albumTitle}
          width={60}
          height={60}
          className="rounded-md object-cover"
        />
      </div>

      {/* 2) Title + artist (flexible) */}
      <div className="ml-[16px] flex-1 min-w-0">
        <h3 className="font-semibold truncate text-[23px] leading-[28px]">
          {albumTitle}
        </h3>
        <p className="text-[16px] leading-[20px] text-gray-600 truncate">
          {artistName}
        </p>
      </div>

      {/* 3a) Rating badge (exactly 90×90) */}
      <div
        className="
          flex-shrink-0
          w-[90px] h-[90px]
          flex items-center justify-center
          ml-[24px]        /* same horizontal gap you had */
        "
      >
        {Badge && <Badge number={rating} />}
      </div>

      {/* 3b) Writing icon (exactly 45×55), 14px to the right of the badge */}
      {hasReview && (
        <div className="flex-shrink-0 w-[45px] h-[55px] ml-[14px]">
          <Image
            src={writingIconSrc}
            alt="Written review icon"
            width={45}
            height={55}
            className="block"
          />
        </div>
      )}

      {/* 4) Reviewer avatar: fixed 85×85 */}
      <div className="flex-shrink-0 w-[85px] h-[85px]">
        <Image
          src={profilePic}
          alt={displayName}
          width={85}
          height={85}
          className="rounded-full object-cover"
        />
      </div>

      {/* 5) Reviewer info + time */}
      <div className="ml-[16px] flex-1 min-w-0 flex items-center">
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate text-[23px] leading-[28px]">
            {displayName}
          </div>
          <div className="text-[16px] leading-[20px] text-gray-600 truncate">
            {userName}
          </div>
        </div>
        {/* time: fixed container so it never wraps */}
        <div className="flex-shrink-0 w-[83px] h-[28px] text-right text-[16px] leading-[28px]">
          {time}
        </div>
      </div>
    </div>
  );
};
