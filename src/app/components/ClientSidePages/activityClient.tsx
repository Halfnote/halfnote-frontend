"use client";
import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { AnotherNavButton } from "../../components/AnotherNavButton";
import { Activity } from "../../types/types";
import Daft from "../../../../public/sample_images/daft.png";
import { useTranslation } from "react-i18next";

import { RecentReviewCard } from "../../components/RecentReviewCard";
import { userOthersActivity } from "@/app/hooks";

type ActivityPageProps = {
  user: {
    username: string;
    access_token: string;
  };
};

type ActivityFilterState = "following" | "friends" | "you";

export default function ActivityPage({ user }: ActivityPageProps) {
  const { t } = useTranslation("activity");

  const [filter, setFilter] = useState<ActivityFilterState>("following");

  const { data: youActivity = [] } = userOthersActivity(user.username, "you");
  const { data: friendActivity = [] } = userOthersActivity(
    user.username,
    "friends"
  );

  const { data: followingActivity = [] } = userOthersActivity(
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
    <div className="flex flex-row gap-4 box-border bg-[#f3f3f3] max-h-screen items-center justify-center mb-10 scale-90">
      <div className="bg-white border-2 border-black p-6 rounded-xl w-full">
        {/* Header + Tabs */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="another-heading1 text-[42px]">
            {t("reviews.recent")}
          </h1>
          <div className="flex gap-4">
            <AnotherNavButton
              label={t("filter.following")}
              onClick={() => setFilter("following")}
              isSelected={filter === "following"}
            />
            <AnotherNavButton
              label={t("filter.friends")}
              onClick={() => setFilter("friends")}
              isSelected={filter === "friends"}
            />
            <AnotherNavButton
              label={t("filter.you")}
              onClick={() => setFilter("you")}
              isSelected={filter === "you"}
            />
          </div>
        </div>

        {/* Scrollable list of cards */}
        <div className="overflow-y-auto min-h-[550px] max-h-[700px] pr-2 flex flex-col gap-4">
          {filteredActivities.length > 0 &&
            filteredActivities.map((activity: Activity) => (
              <RecentReviewCard
                key={activity.id}
                albumCover={
                  activity.review_details?.album?.cover_url || Daft.src
                }
                albumTitle={
                  activity.review_details?.album?.title || "Unknown Album"
                }
                artistName={
                  activity.review_details?.album?.artist || "Unknown Artist"
                }
                rating={activity.review_details?.rating || 0}
                genre={
                  activity.review_details?.user_genres?.length > 0
                    ? activity.review_details.user_genres[0]?.name || "Unknown"
                    : "Unknown"
                }
                hasReview={
                  activity.review_details?.content?.length > 0 || false
                }
                profilePic={
                  activity.user?.avatar || "/sample_images/profilePic.png"
                }
                displayName={activity.user?.username || "Unknown User"}
                userName={`@${activity.user?.username || "unknown"}`}
                time={activity?.created_at}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
