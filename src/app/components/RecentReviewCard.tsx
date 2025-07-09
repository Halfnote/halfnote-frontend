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
    <div className="flex flex-row w-full border border-black rounded-2xl bg-white px-6 h-[100px] shadow-md">
      <div className="flex flex-row items-center justify-between w-1/2 pr-2">
        <div className="flex flex-row items-center">
          <div className="flex-shrink-0 w-[70px] h-[70px] rounded-[10px] overflow-hidden">
            <Image
              src={albumCover}
              alt={albumTitle}
              width={70}
              height={70}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-center ml-6 min-w-[120px]">
            <span style={{ fontWeight: "normal" }} className="another-heading4">
              {albumTitle}
            </span>
            <span className="text-base text-black leading-tight">
              {artistName}
            </span>
          </div>
        </div>
        <div
          className="flex-shrink-0 flex items-center justify-center
                        w-20 h-20    
                        overflow-hidden"
        >
          {genreBadge({ genre, rating })}
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-1/2 pl-4 gap-x-40">
        <div className="flex items-center justify-center min-w-[40px]">
          {hasReview && (
            <Image
              src={writingIconSrc}
              alt="Written review icon"
              width={32}
              height={32}
            />
          )}
        </div>
        <div className="flex-1 flex flex-row items-center justify-start">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex-shrink-0 border border-black">
            <Image
              src={profilePic}
              alt={displayName}
              width={60}
              height={60}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-center ml-4">
            <span className="another-heading4">{displayName}</span>
            <span className="text-black text-base leading-tight">
              {userName}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end min-w-[100px] text-black text-base text-right">
          {time}
        </div>
      </div>
    </div>
  );
};
