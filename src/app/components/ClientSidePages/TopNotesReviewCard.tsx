import { useToggleReview } from "@/app/hooks";
import { Review } from "@/app/types/types";
import Image from "next/image";
import RatingBadge from "../ratingBadge";
import { Icons } from "@/app/icons/icons";
import { generateRatingStamp, getTimeAgo } from "@/app/utils/calculations";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { text } from "stream/consumers";
import { ExpandedReviewModal } from "./expandedReviewModal";
type TopNotesReviewCardProps = {
  review: Review;
  username: string;
  className?: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSelected: Dispatch<SetStateAction<Review | undefined>>;
};
export const TopNotesReviewCard = ({
  review,
  username,
  setOpen,
  setSelected,
}: TopNotesReviewCardProps) => {
  const handleExpand = () => {
    console.log("expanding");
  };
  const textRef = useRef(null);
  const isOverFlowing = (element: HTMLElement | null) => {
    if (element) {
      return element.scrollHeight > element.clientHeight;
    }
  };
  const { toggleLikeMutation, isPending } = useToggleReview(
    username,
    review.album_discogs_id
  );

  const handleOpen = () => {
    setOpen(true);
    setSelected(review);
  };
  return (
    <>
      <div className="p-4 border-1 border-gray-500 rounded-xl bg-white w-full h-55 relative hover:cursor-grab">
        <div
          key={review.id}
          className="grid grid-cols-[auto_1fr_auto] gap-4 h-full"
        >
          {/* avatar */}
          <div className="flex items-start justify-start">
            <Image
              src={review.user_avatar}
              alt={review.username}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>

          {/* review and user content */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <p className="another-heading4">{review.username}</p>
              <p className="another-heading5 text-gray-400">
                @{review.username}
              </p>
              <p className="another-heading5 text-gray-400">
                {getTimeAgo(review.created_at)}
              </p>
            </div>

            <p
              className="another-heading5 text-md flex-1 overflow-hidden text-ellipsis line-clamp-4 mb-4"
              ref={textRef}
            >
              {review.content}
            </p>

            <div className="mt-auto flex flex-row gap-2">
              <button
                disabled={isPending}
                onClick={() => toggleLikeMutation.mutate(review.id)}
                className={`flex items-center justify-center gap-1 border border-black rounded-full bg-[#f4f4f4] text-sm text-black w-12 h-7 transition-opacity duration-200 ${
                  isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:cursor-pointer"
                }`}
              >
                <Image
                  src={
                    review.is_liked_by_user
                      ? Icons.likedHeart
                      : Icons.unlikedHeart
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
              {isOverFlowing(textRef.current) && (
                <button
                  disabled={isPending}
                  onClick={handleOpen}
                  className="flex items-center justify-center gap-1 border border-black rounded-full bg-[#f4f4f4] text-sm text-black w-auto h-7 transition-opacity duration-200 px-2 cursor-pointer"
                >
                  <Image
                    src={Icons.expandIcon}
                    alt="Expand icon"
                    width={12}
                    height={12}
                    className="object-contain"
                  />
                  <span className="text-[13px] font-medium">Expand</span>
                </button>
              )}
            </div>
          </div>

          {/* rating */}
          <div className="flex items-start justify-end">
            <Image
              width={55}
              height={55}
              src={generateRatingStamp(review.rating, { empty: false })}
              alt="Badge"
            />
          </div>
        </div>
      </div>
    </>
  );
};
