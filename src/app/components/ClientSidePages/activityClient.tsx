"use client";
import { useMemo, useState } from "react";
import { AnotherNavButton } from "../../components/AnotherNavButton";
import { Activity, Review } from "../../types/types";
import { useTranslation } from "react-i18next";
import { useOthersActivity } from "@/app/hooks";
import { Button } from "../general/Button";
import { ProperReviewCard } from "./ProperReviewCard";

type ActivityPageProps = {
  user: {
    username: string;
  };
};

type ActivityFilterState = "following" | "friends" | "you";

const extractReviewFromActivity = (activity: Activity): Review => {
  const review_details = activity.review_details;
  return {
    id: review_details.id,
    album_discogs_id: review_details.album.discogs_id,
    text: review_details.content,
    username: activity.user.username,
    user_avatar: activity.user.avatar,
    user_is_staff: activity.user.is_staff ?? false,
    rating: review_details.rating,
    content: review_details.content,
    created_at: activity.created_at,
    album_title: review_details.album.title,
    album_artist: review_details.album.artist,
    album_cover: review_details.album.cover_url,
    album_year: review_details.album.year,
    is_pinned: false,
    likes_count: review_details.likes_count,
    is_liked_by_user: review_details.is_liked_by_user,
    comments_count: review_details.comments_count,
    user_genres: review_details.user_genres,
  };
};

export default function ActivityPage({ user }: ActivityPageProps) {
  const { t } = useTranslation("activity");

  const [filter, setFilter] = useState<ActivityFilterState>("following");

  const { data: youActivity = [] } = useOthersActivity(user.username, "you");
  const { data: friendActivity = [] } = useOthersActivity(
    user.username,
    "friends"
  );

  const { data: followingActivity = [] } = useOthersActivity(
    user.username,
    "incoming"
  );

  // Derive filtered activities dynamically using useMemo
  const filteredActivities = useMemo(() => {
    switch (filter) {
      case "you":
        return youActivity;
      case "friends":
        return friendActivity;
      default:
        return followingActivity;
    }
  }, [youActivity, friendActivity, followingActivity, filter]);

  return (
    <div className="flex flex-col border-black border-2 bg-white rounded-xl overflow-scroll pb-10 h-auto px-9 py-9 w-[70%]">
      {/* Header + Tabs */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="another-heading1 text-[42px]">
          {/* {t("reviews.activity")} */}
          Recent Activity
        </h1>
        <div className="flex gap-4">
          <Button
            onClick={() => setFilter("following")}
            isSelected={filter === "following"}
          >
            {t("filter.following")}
          </Button>
          <Button
            onClick={() => setFilter("friends")}
            isSelected={filter === "friends"}
          >
            {t("filter.friends")}
          </Button>
          <Button
            onClick={() => setFilter("you")}
            isSelected={filter === "you"}
          >
            {t("filter.you")}
          </Button>
        </div>
      </div>

      {/* Scrollable list of cards */}
      <div className="overflow-y-auto min-h-[550px] max-h-[700px] pr-2 flex flex-col gap-4">
        {filteredActivities.length > 0 &&
          filteredActivities.map((activity: Activity) => (
            <ProperReviewCard
              key={activity.id}
              review={extractReviewFromActivity(activity)}
              username={activity.user.username}
              setOpen={() => {}}
            />
          ))}
      </div>
    </div>
  );
}
