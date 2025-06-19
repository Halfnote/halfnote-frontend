"use client";
import Image, { StaticImageData } from "next/image";
import { RockBadge } from "../icons/stamps";
import { Icons } from "../icons/icons";
import { useState } from "react";
import { likeReview } from "../actions/reviews_service";
import { Review } from "../types/types";
type ReviewCardProps = {
  avatar?: string;
  review: Review;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
};

export default function ReviewCard({
  review,
  setReviews,
  avatar,
}: ReviewCardProps) {
  const [likingReviews, setLikingReviews] = useState<Set<number>>(new Set()); // Track which reviews are being liked

  const formattedDate = new Date(review.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
  const handleLikeReview = async (
    reviewId: number,
    currentlyLiked: boolean
  ) => {
    if (likingReviews.has(reviewId)) return; // Prevent double-clicks

    setLikingReviews((prev) => new Set(prev).add(reviewId));
    try {
      await likeReview(reviewId);
      // Update the review in both pinned and regular reviews
      const updateReview = (review: Review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            is_liked_by_user: !currentlyLiked,
            likes_count: currentlyLiked
              ? review.likes_count - 1
              : review.likes_count + 1,
          };
        }
        return review;
      };

      setReviews((prev) => prev.map(updateReview));
    } catch (error: any) {
      console.error("Error toggling like:", error);
      alert("Error updating like status");
    } finally {
      setLikingReviews((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    }
  };
  return (
    <div className="flex p-4 border border-gray-300 rounded-xl shadow-md bg-white gap-4 w-full max-w-[600px] min-h-[250px]">
      {/* Album Cover */}
      <div className="relative flex-shrink-0 w-[150px] h-[150px] border-[1px] border-black">
        <Image
          src={review.album_cover}
          alt={`${review.album_title} cover`}
          fill
          className="object-cover"
        />
      </div>

      {/* Right: Content */}
      <div className="flex flex-col justify-between flex-grow relative pr-3">
        {/* Rating Badge */}
        <div className="absolute right-0 -top-4 scale-70">
          <RockBadge number={review.rating} />
        </div>

        {/* Title, Artist, Review */}
        <div className="flex flex-col gap-1">
          <h2 className="another-heading3 font-bold">{review.album_title}</h2>
          <p className="text-md text-gray-800 font-medium">
            {review.album_artist}
          </p>
          <p className="another-heading5 mt-2 text-sm line-clamp-4 leading-relaxed text-gray-700 overflow-y-auto">
            {review.content}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Image
              src={avatar || "/default-avatar.png"}
              alt="Profile Picture"
              width={40}
              height={40}
              className="object-cover rounded-full ring-2 border-black border-[1px]"
            />
            <p className="another-heading5 font-semibold">{review.username}</p>
            <p className="another-heading5 text-gray-500">{formattedDate}</p>
          </div>

          <button
            onClick={() => handleLikeReview(review.id, review.is_liked_by_user)}
            className="flex items-center justify-center gap-1 border border-black rounded-full bg-[#f4f4f4] text-sm text-black w-12 h-7 hover:cursor-pointer"
          >
            <Image
              src={
                review.is_liked_by_user ? Icons.likedHeart : Icons.unlikedHeart
              }
              alt="Favorite Icon"
              width={12}
              height={12}
              className="object-contain"
            />

            <span className="text-[13px] font-medium">
              {review.likes_count}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
