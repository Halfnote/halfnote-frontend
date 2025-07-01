"use client";
import { useState } from "react";
import { useEffect } from "react";
import { DateTime } from "luxon";
import { AnotherNavButton } from "../../components/AnotherNavButton";
import { Review } from "../../types/types";
import Daft from "../../../../public/sample_images/daft.png";
import { RecentReviewCard } from "../../components/RecentReviewCard";

type ActivityPageProps = {
  user: {
    username: string;
    access_token: string;
  };
};

export default function ActivityPage({ user }: ActivityPageProps) {
  // Filter State
  const [filter, setFilter] = useState<"following" | "friends" | "you">(
    "following"
  );

  // Store Fetched Reviews
  const [reviews, setReviews] = useState<Review[]>([]);

  const getActivityReviews = async (setter: (value: Review[]) => void) => {
    try {
      const res = await fetch("/sample_data/reviews.json");

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch activity reviews");
      }

      const data = await res.json();
      setter(data.results);
    } catch (e) {
      console.error("Activity fetch error:", e);
    }
  };

  // load them on mount
  useEffect(() => {
    getActivityReviews(setReviews);
  }, []);

  // Filter array based on tab
  const filtered = reviews.filter((r) => {
    if (filter === "you") return r.user.username === "yourUsername";
    if (filter === "friends")
      return ["vinylqueen", "audiophile99"].includes(r.user.username);
    // "following" case—just show all for now
    return true;
  });
  return (
    <div className="flex flex-row gap-4 box-border bg-[#f3f3f3] max-h-screen items-center justify-center mb-10">
      <div className="bg-white border-2 border-black p-6 rounded-xl w-full">
        {/* Header + Tabs */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="another-heading1 text-[42px]">Recent Reviews</h1>
          <div className="flex gap-4">
            <AnotherNavButton
              label="Following"
              onClick={() => setFilter("following")}
              isSelected={filter === "following"}
            />
            <AnotherNavButton
              label="Friends"
              onClick={() => setFilter("friends")}
              isSelected={filter === "friends"}
            />
            <AnotherNavButton
              label="You"
              onClick={() => setFilter("you")}
              isSelected={filter === "you"}
            />
          </div>
        </div>

        {/* Scrollable list of cards */}
        <div className="overflow-y-auto max-h-[700px] pr-2">
          {filtered.map((r) => (
            <RecentReviewCard
              key={r.id}
              albumCover={Daft}
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
