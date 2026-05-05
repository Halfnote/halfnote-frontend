"use client";
import { useMemo, useState } from "react";
import { Activity, Review } from "../../types/types";
import { ActivityFilterType, ACTIVITY_FILTER_LABELS } from "@/app/lib/types/api";
import { useOthersActivity } from "@/app/hooks";
import { Button } from "../general/Button";
import { ProperReviewCard } from "./ProperReviewCard";

type ActivityPageProps = {
  user: {
    username: string;
  };
};

const extractReviewFromActivity = (activity: Activity): Review | null => {
  const rd = activity.review_details;
  if (!rd) return null;

  return {
    id: rd.id,
    album_discogs_id: rd.album.discogs_id,
    username: rd.user.username,
    user_avatar: rd.user.avatar ?? null,
    user_is_staff: rd.user.is_staff ?? false,
    rating: rd.rating,
    content: rd.content,
    created_at: activity.created_at,
    album_title: rd.album.title,
    album_artist: rd.album.artist,
    album_cover: rd.album.cover_url ?? null,
    album_artist_photo: null, // Not available from ReviewActivityDetails
    album_year: rd.album.year,
    is_pinned: false,
    likes_count: rd.likes_count ?? 0,
    is_liked_by_user: rd.is_liked_by_user,
    comments_count: rd.comments_count ?? 0,
    user_genres: rd.user_genres,
  };
};

export default function ActivityPage({ user }: ActivityPageProps) {
  const [filter, setFilter] = useState<ActivityFilterType>(
    ActivityFilterType.INCOMING,
  );

  const { data: youActivity = [], isLoading: isLoadingYou } = useOthersActivity(
    user.username,
    ActivityFilterType.YOU,
  );
  const { data: friendActivity = [], isLoading: isLoadingFriends } =
    useOthersActivity(user.username, ActivityFilterType.FRIENDS);

  const { data: followingActivity = [], isLoading: isLoadingFollowing } =
    useOthersActivity(user.username, ActivityFilterType.INCOMING);

  // Derive filtered activities dynamically using useMemo
  const filteredActivities = useMemo(() => {
    switch (filter) {
      case ActivityFilterType.YOU:
        return youActivity;
      case ActivityFilterType.FRIENDS:
        return friendActivity;
      case ActivityFilterType.INCOMING:
      default:
        return followingActivity;
    }
  }, [youActivity, friendActivity, followingActivity, filter]);

  return (
    <div className="flex flex-col border-black border-2 bg-white rounded-xl pb-10 h-auto px-9 py-9 w-full">
      {/* Header + Tabs */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="another-heading1 text-[42px]">Activity</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => setFilter(ActivityFilterType.INCOMING)}
            isSelected={filter === ActivityFilterType.INCOMING}
          >
            {ACTIVITY_FILTER_LABELS[ActivityFilterType.INCOMING]}
          </Button>
          <Button
            onClick={() => setFilter(ActivityFilterType.FRIENDS)}
            isSelected={filter === ActivityFilterType.FRIENDS}
          >
            {ACTIVITY_FILTER_LABELS[ActivityFilterType.FRIENDS]}
          </Button>
          <Button
            onClick={() => setFilter(ActivityFilterType.YOU)}
            isSelected={filter === ActivityFilterType.YOU}
          >
            {ACTIVITY_FILTER_LABELS[ActivityFilterType.YOU]}
          </Button>
        </div>
      </div>

      {/* Scrollable list of cards */}
      <div className="overflow-y-auto min-h-[550px] max-h-[700px] pr-2 flex flex-col gap-4">
        {(isLoadingYou || isLoadingFriends || isLoadingFollowing) && (
          <p className="text-gray-500 italic">Loading activity...</p>
        )}
        {!isLoadingYou &&
          !isLoadingFriends &&
          !isLoadingFollowing &&
          filteredActivities.length === 0 && (
            <p className="text-gray-500 italic">
              No activity found for this filter.
            </p>
          )}
        {filteredActivities.length > 0 &&
          filteredActivities.map((activity: Activity) => {
            const review = extractReviewFromActivity(activity);
            if (!review) return null;
            return (
              <ProperReviewCard
                key={activity.id}
                review={review}
                username={activity.user.username}
                setOpen={() => {}}
              />
            );
          })}
      </div>
    </div>
  );
}
