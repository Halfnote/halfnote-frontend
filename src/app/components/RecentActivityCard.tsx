import React from "react";
import Image, { StaticImageData } from "next/image";
import { genreBadge } from "../utils/calculations";
import { Icons } from "../icons/icons";
import { getTimeAgo } from "../utils/calculations";

type RecentActivityCardProps = {
  albumCover: string;
  albumTitle: string;
  artistName: string;
  rating: number;
  genre: string;
  hasReview: boolean;
  time: string;
};

export const RecentActivityCard = ({
  albumCover,
  albumTitle,
  artistName,
  rating,
  genre,
  hasReview,
  time,
}: RecentActivityCardProps) => {
  const timeAgo = getTimeAgo(time);
  return (
    <div className="flex flex-row w-full border border-black rounded-2xl bg-white px-6 h-[100px] shadow-md">
      {/* Left half */}
      <div className="flex flex-row items-center justify-between w-1/2 pr-3">
        {/* Album art + info */}
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
          <div className="flex flex-col justify-center ml-4 min-w-[90px]">
            <span style={{ fontWeight: "normal" }} className="another-heading4">
              {albumTitle}
            </span>
            <span className="another-heading5 text-gray-500">{artistName}</span>
          </div>
        </div>
        {/* Score badge */}
        <div
          className="flex-shrink-0 flex items-center justify-center
                w-16 h-16    
                overflow-hidden"
        >
          {genreBadge({ genre, rating })}
        </div>
      </div>

      {/* Right half */}
      <div className="flex flex-row items-center w-1/2 pl-3">
        <div className="flex items-center gap-2 min-w-[32px]">
          {hasReview && (
            <Image
              src={Icons.lines}
              alt="Written review icon"
              width={24}
              height={24}
            />
          )}
          <span className="another-heading5 ml-6">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};
