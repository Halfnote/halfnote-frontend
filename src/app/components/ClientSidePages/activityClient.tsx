"use client";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { DateTime } from "luxon";
import { AnotherNavButton } from "../../components/AnotherNavButton";
import { Review } from "../../types/types";
import Daft from "../../../public/sample_images/daft.png";
import { useTranslation } from "react-i18next";

import { RecentReviewCard } from "../../components/RecentReviewCard";

// Constants
// TODO: replace FRIENDS_LIST with real data
const FRIENDS_LIST = ["vinylqueen", "audiophile99"];

type ActivityFilterState = "following" | "friends" | "you";

export default function ActivityPage() {
  const { t } = useTranslation("activity");

  const [filter, setFilter] = useState<ActivityFilterState>("following");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/sample_data/reviews.json");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || t("reviews.failed_to_fetch"));
        }
        const data = await res.json();
        setReviews(data.results);
      } catch (e) {
        console.error(t("reviews.failed_to_fetch"), e);
      }
    };

    fetchReviews();
  }, []);

  // Derive filtered reviews dynamically using useMemo
  const filteredReviews = useMemo(() => {
    switch (filter) {
      case "you":
        return reviews.filter((r) => r.user.username === "yourUsername");
      case "friends":
        return reviews.filter((r) => FRIENDS_LIST.includes(r.user.username));
      default: // "following"
        return reviews;
    }
  }, [reviews, filter]);

  return (
    <div className="flex flex-row gap-4 box-border bg-[#f3f3f3] max-h-screen items-center justify-center mb-10">
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
        <div className="overflow-y-auto min-h-[550px] max-h-[700px] pr-2">
          {filteredReviews.length > 0 &&
            filteredReviews.map((r) => (
              <RecentReviewCard
                key={r.id}
                albumCover={Daft.src}
                albumTitle={"Midnight Memories"}
                artistName={"One Direction"}
                rating={r.rating}
                genre={"Pop"}
                hasReview={r.text.length > 0}
                profilePic={"/sample_images/profilePic.png"}
                displayName={r.user.username}
                userName={`@${r.user.username}`}
                time={
                  DateTime.fromISO(r.created_at)
                    .toRelative()!
                    .replace(" ago", "") + " ago"
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
}
