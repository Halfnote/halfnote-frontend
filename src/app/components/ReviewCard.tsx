"use client";
import Image, { StaticImageData } from "next/image";
import { RockBadge } from "../icons/stamps";
import { Icons } from "../icons/icons";
type ReviewCardProps = {
  coverArtUrl: StaticImageData;
  reviewerName: string;
  reviewerAvatarUrl: StaticImageData;
  rating: number;
  reviewTitle: string;
  artistName: string;
  reviewText: string;
  createdAt: string;
  likes: number;
};

export default function ReviewCard({
  coverArtUrl,
  reviewerName,
  reviewerAvatarUrl,
  rating,
  reviewTitle,
  artistName,
  reviewText,
  createdAt,
  likes,
}: ReviewCardProps) {
  return (
    <div className="relative flex p-4 border border-gray-300 rounded-xl shadow-lg bg-white gap-4 max-w-[900px] h-60 mb-5">
      {/* Album Cover */}
      <div className="relative flex-shrink-0 h-full aspect-square border-[1px] border-black">
        <Image
          src={coverArtUrl}
          alt={`${reviewTitle} cover`}
          fill
          className="object-cover"
        />
      </div>

      {/* Right: Content */}
      <div className="flex flex-col justify-between flex-grow relative mt-2">
        {/* Rating Badge */}
        <div className="w-[75px] absolute flex right-0 -top-4">
          <RockBadge number={rating} />
        </div>

        {/* Title & Artist */}
        <div>
          <h2 style={{ fontWeight: "bold" }} className="another-heading3">
            {reviewTitle}
          </h2>
          <p className="text-md text-gray-800">{artistName}</p>
          <p className="another-heading5 mt-2 line-clamp-5">{reviewText}</p>
        </div>

        <div className="flex flex-row gap-2">
          <div className="flex items-center gap-2">
            <Image
              src={reviewerAvatarUrl}
              alt="Profile Picture"
              className="aspect-square w-[40px] object-cover rounded-full ring-2 border-black border-[1px]"
            />
            <p style={{ fontWeight: "bold" }} className="another-heading5">
              {reviewerName}
            </p>
            <p className="another-heading5 text-gray-600">{createdAt}</p>
          </div>

          <div className="mt-1 flex items-center justify-center gap-1 border border-black rounded-full bg-[#f4f4f4] text-sm text-black w-12 h-7">
            <Image
              src={Icons.heart}
              alt="Favorite Icon"
              width={12}
              height={12}
              className="object-contain"
            />
            <span className="text-[13px] font-medium">{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
