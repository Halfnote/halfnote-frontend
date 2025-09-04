import { Review } from "../types/types";
import Image from "next/image";
import { generateRatingStamp } from "../utils/calculations";
import { useToggleReview } from "../hooks";
import { Icons } from "../icons/icons";
import { getTimeAgo } from "../utils/calculations";

interface AlbumDetailRecentActivityProps {
  activity: Review;
  username: string;
}
export const AlbumDetailRecentActivity = ({
  activity,
  username,
}: AlbumDetailRecentActivityProps) => {
  const { toggleLikeMutation, isPending } = useToggleReview(
    username,
    activity.album_discogs_id
  );

  return (
    <div
      key={activity.id}
      className="bg-white border border-black rounded-2xl p-4 mb-4 flex items-start justify-between"
    >
      {/* Left section: avatar + text */}
      <div className="flex flex-row gap-3 flex-1">
        <Image
          src={activity.user_avatar}
          alt={activity.username}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <div className="flex flex-row gap-2 items-center">
            <h3 className="another-heading4">{activity.username}</h3>
            <span className="another-heading6 text-gray-400 font-normal">{`@${activity.username}`}</span>
            <span className="another-heading6 text-gray-400 font-normal">{`${getTimeAgo(
              activity.created_at
            )}`}</span>
          </div>
          <p className="another-heading6">{activity.content}</p>
          <button
            disabled={isPending}
            onClick={() => toggleLikeMutation.mutate(activity.id)}
            className={`flex items-center justify-center gap-1 border border-black rounded-full bg-[#f4f4f4] text-sm text-black w-12 h-7 mt-2 transition-opacity duration-200 ${
              isPending
                ? "opacity-50 cursor-not-allowed"
                : "hover:cursor-pointer"
            }`}
          >
            <Image
              src={
                activity.is_liked_by_user
                  ? Icons.likedHeart
                  : Icons.unlikedHeart
              }
              alt="Favorite Icon"
              width={12}
              height={12}
              className="object-contain"
            />
            <span className="text-[13px] font-medium">
              {activity.likes_count}
            </span>
          </button>
        </div>
      </div>

      {/* Right section: rating + like button */}
      <div className="flex flex-col items-center ml-4">
        <Image
          width={55}
          height={55}
          src={generateRatingStamp(activity.rating)}
          alt="Badge"
        />
      </div>
    </div>
  );
};
