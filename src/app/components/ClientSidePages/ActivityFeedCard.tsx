"use client";
import Image from "next/image";
import { Activity } from "@/app/types/types";
import { Icons } from "@/app/icons/icons";
import { generateRatingStamp, getTimeAgo } from "@/app/utils/calculations";
import { useToggleReview } from "@/app/hooks";

type Props = {
  activity: Activity;
  currentUsername: string;
};

export const ActivityFeedCard = ({ activity, currentUsername }: Props) => {
  const rd = activity.review_details;
  const { toggleLikeMutation, isPending } = useToggleReview(
    currentUsername,
    rd?.album.discogs_id ?? "",
  );

  if (!rd) return null;

  return (
    <div className="py-5 flex gap-5 items-start">
      <div className="flex-shrink-0 flex gap-3 items-start w-64">
        <div className="flex-shrink-0">
          {rd.album.cover_url ? (
            <Image
              src={rd.album.cover_url}
              alt={rd.album.title}
              width={110}
              height={110}
              className="rounded-sm object-cover w-[110px] h-[110px]"
            />
          ) : (
            <div className="w-[110px] h-[110px] bg-gray-200 rounded-sm" />
          )}
        </div>
        <div className="flex flex-col justify-start pt-1">
          <p className="another-heading1 leading-snug text-4xl">
            {rd.album.title}
          </p>
          <p className="another-heading5 text-gray-500 text-sm font-bold mt-1">
            {rd.album.artist}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-2">
          <Image
            src={activity.user.avatar || "/default-avatar.png"}
            alt={activity.user.username}
            width={36}
            height={36}
            className="rounded-full object-cover w-9 h-9 flex-shrink-0"
          />
          <span className="another-heading5 font-semibold text-sm">
            {activity.user.username}
          </span>
          <span className="another-heading5 text-gray-400 text-sm">
            @{activity.user.username}
          </span>
          <span className="another-heading5 text-gray-400 text-sm">
            {getTimeAgo(activity.created_at)}
          </span>
        </div>

        {rd.content && (
          <p className="another-heading4 text-sm leading-relaxed line-clamp-3">
            {rd.content}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1">
          <button
            disabled={isPending}
            onClick={() => toggleLikeMutation.mutate(rd.id)}
            className={`flex items-center justify-center gap-1 border border-black rounded-full bg-white text-sm px-3 h-8 transition-opacity duration-200 ${
              isPending
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <Image
              src={rd.is_liked_by_user ? Icons.likedHeart : Icons.unlikedHeart}
              alt="like"
              width={12}
              height={12}
              className="object-contain"
            />
            <span className="text-[13px] font-medium tabular-nums min-w-[1ch]">{rd.likes_count}</span>
          </button>
          <button className="border border-black rounded-full bg-white px-3 h-8 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
            Follow
          </button>
          <button className="border border-black rounded-full bg-white px-3 h-8 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
            Share
          </button>
        </div>
      </div>

      <Image
        src={generateRatingStamp(rd.rating, { empty: false })}
        alt={`Rating ${rd.rating}`}
        width={60}
        height={60}
        className="flex-shrink-0 pt-1"
      />
    </div>
  );
};
