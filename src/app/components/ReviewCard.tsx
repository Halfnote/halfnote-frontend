"use client";
import Image, { StaticImageData } from "next/image";
import { JazzBadge, PopBadge, RockBadge } from "../icons/stamps";

type ReviewCardProps = {
  coverArtUrl?: StaticImageData;
  reviewerName: string;
  reviewerAvatarUrl?: string;
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
    <div className="flex gap-4 border border-[#9A9A9A] rounded-xl p-4 bg-white mb-4">
      <div className="relative w-35 h-35 mt-3">
        <Image
          src={coverArtUrl}
          alt={reviewTitle}
          width={200}
          height={200}
          className="object-cover rounded-md"
        />
        {/* Rating badge */}
        <div className="w-15 h-15 absolute -top-4 left-[75%] flex items-center justify-center">
          <RockBadge number={rating} />
        </div>
      </div>

      {/* Review Content */}
      <div className="flex flex-col flex-grow justify-between ml-5">
        {/* Top Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {reviewerAvatarUrl && (
              <Image
                src={reviewerAvatarUrl}
                alt={reviewerName}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <p className="another-body">
              Review by <span className="font-semibold">{reviewerName}</span>
            </p>
          </div>
          <p className="another-body">{createdAt}</p>
        </div>

        {/* Album Title & Artist */}
        <div className="mt-2">
          <h3 className="text-md font-bold">{reviewTitle}</h3>
          <p className="another-body">{artistName}</p>
        </div>

        {/* Review Text */}
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{reviewText}</p>

        {/* Bottom Row */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>♡ Like review</span>
            <span className="text-gray-400">{likes} likes</span>
          </div>
          <button className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100 transition">
            Full review
          </button>
        </div>
      </div>
    </div>
  );
}
