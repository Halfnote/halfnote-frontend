import React from "react";
import Image, { StaticImageData } from "next/image";
import writingIconSrc from "../icons/miscellaneous/Writing_Icon.svg";
import { genreBadge } from "../utils/calculations";

type RecentReviewCardProps = {
  albumCover: string;
  albumTitle: string;
  artistName: string;
  rating: number;
  genre: string;
  hasReview: boolean;
  profilePic: StaticImageData | string;
  displayName: string;
  userName: string;
  time: string;
};

export const RecentReviewCard = ({
  albumCover,
  albumTitle,
  artistName,
  rating,
  genre,
  hasReview,
  profilePic,
  displayName,
  userName,
  time,
}: RecentReviewCardProps) => {
  return (
    <div className="flex flex-row w-full border border-black rounded-[24px] bg-white px-6 py-4 mb-4 shadow-sm min-h-[110px]">
      {/* Left half */}
      <div className="flex flex-row items-center justify-between w-1/2 pr-4">
        {/* Album art + info */}
        <div className="flex flex-row items-center">
          <div className="flex-shrink-0 w-[99px] h-[99px] rounded-[12px] overflow-hidden">
            <Image
              src={albumCover}
              alt={albumTitle}
              width={99}
              height={99}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-center ml-6 min-w-[120px]">
            <span className="font-bold text-lg text-black leading-tight">
              {albumTitle}
            </span>
            <span className="text-base text-black leading-tight">
              {artistName}
            </span>
          </div>
        </div>
        {/* Score badge */}
        <div className="flex flex-row items-center justify-end">
          {genreBadge({ genre, rating })}
        </div>
      </div>

      {/* Right half */}
      <div className="flex flex-row items-center justify-between w-1/2 pl-4">
        {/* Review icon (if present) */}
        <div className="flex items-center justify-start min-w-[40px]">
          {hasReview && (
            <Image
              src={writingIconSrc}
              alt="Written review icon"
              width={32}
              height={32}
            />
          )}
        </div>
        {/* Profile group centered */}
        <div className="flex-1 flex flex-row items-center justify-center mx-4">
          <div className="w-[56px] h-[56px] rounded-full overflow-hidden flex-shrink-0 border border-black">
            <Image
              src={profilePic}
              alt={displayName}
              width={56}
              height={56}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="flex flex-col justify-center ml-4">
            <span className="font-semibold text-black text-lg leading-tight">
              {displayName}
            </span>
            <span className="text-black text-base leading-tight">
              {userName}
            </span>
          </div>
        </div>
        {/* Time right-aligned */}
        <div className="flex items-center justify-end min-w-[60px] text-black text-base text-right">
          {time}
        </div>
      </div>
    </div>
  );
};
