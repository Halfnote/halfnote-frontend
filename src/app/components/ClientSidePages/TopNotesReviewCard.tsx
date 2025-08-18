import { useToggleReview } from "@/app/hooks";
import { Review } from "@/app/types/types";
import Image from "next/image";
import RatingBadge from "../ratingBadge";
import { Icons } from "@/app/icons/icons";

type TopNotesReviewCardProps = {
  review: Review;
  username: string;
};
export const TopNotesReviewCard = ({
  review,
  username,
}: TopNotesReviewCardProps) => {
  const { toggleLikeMutation, isPending } = useToggleReview(
    username,
    review.album_discogs_id
  );
  return (
    <div
      key={review.id}
      className="p-4 border-1 border-gray-500 rounded-xl  bg-white w-100 h-40 relative"
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center space-x-2">
          <Image
            src={review.user_avatar}
            alt={review.username}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="another-heading4">{review.username}</span>
        </div>
        <span className="text-sm text-gray-500">
          <RatingBadge rating={review.rating} />
        </span>
      </div>
      <p className="font-light text-xl truncate">{review.content}</p>
      <button
        disabled={isPending}
        onClick={() => toggleLikeMutation.mutate(review.id)}
        className={`absolute bottom-4 right-4 flex items-center justify-center gap-1 border border-black rounded-full bg-[#f4f4f4] text-sm text-black w-12 h-7 transition-opacity duration-200 ${
          isPending ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"
        }`}
      >
        <Image
          src={review.is_liked_by_user ? Icons.likedHeart : Icons.unlikedHeart}
          alt="Favorite Icon"
          width={12}
          height={12}
          className="object-contain"
        />
        <span className="text-[13px] font-medium">{review.likes_count}</span>
      </button>
    </div>
  );
};
