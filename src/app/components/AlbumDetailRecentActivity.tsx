import { Review } from "../types/types";
import Image from "next/image";

import { generateRatingStamp } from "../utils/calculations";
import { useToggleReview } from "../hooks";
import { Icons } from "../icons/icons";

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
      className="bg-white border border-black rounded-2xl p-4 mb-4 grid grid-cols-[15%_70%_15%]"
    >
      <Image
        src={activity.user_avatar}
        alt={activity.username}
        width={56}
        height={56}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div className="align-baseline">
        <div className="flex flex-row items-center space-x-3">
          <div className="flex flex-row gap-x-2 items-baseline">
            <h3 className="another-heading4">{activity.username}</h3>
            <h4 className="another-heading6 text-gray-400 font-normal">{`@${activity.username}`}</h4>
          </div>
        </div>
        <p className="another-heading6">{activity.content}</p>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <Image
          width={75}
          height={75}
          src={generateRatingStamp(activity.rating)}
          alt={` Badge`}
        />

        <button
          disabled={isPending}
          onClick={() => toggleLikeMutation.mutate(activity.id)}
          className={`flex items-center justify-center gap-1 border border-black rounded-full bg-[#f4f4f4] text-sm text-black w-12 h-7 transition-opacity duration-200 ${
            isPending ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"
          }`}
        >
          <Image
            src={
              activity.is_liked_by_user ? Icons.likedHeart : Icons.unlikedHeart
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
  );
};
