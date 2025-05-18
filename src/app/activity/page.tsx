"use client";
import { useState } from "react";
import { useEffect } from "react";
import { DateTime } from "luxon";
import Image from "next/image";
import { Icons } from "@/app/icons/icons";
import ReviewCard from "../components/ReviewCard";
import { AnotherNavButton } from "../components/AnotherNavButton";
import { ActivityReviewCard } from "../components/ActivityReviewCard";
import type { Review } from "../types/review";
import Actor from "../../public/sample_images/profilePic.png";
import Daft from "../../../public/sample_images/daft.png";

import Charlie from "../../public/sample_images/charlie.png";


export default function ActivityPage() {
  // Filter State
  const [filter, setFilter] = useState<"following" | "friends" | "you">("following");

  // Store Fetched Reviews
  const [reviews, setReviews] = useState<Review[]>([]);

  const getActivityReviews = async (
    setter: (value: Review[]) => void
  ) => {
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
    <div className="flex justify-center bg-[#f3f3f3] min-h-screen py-10">
      <div className="bg-white border-2 border-black rounded-[25px] p-6 w-[1770px]">

        {/* Header + Tabs */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="another-heading1">Recent Reviews</h1>
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
            <ActivityReviewCard
              albumCover={Daft}
              albumTitle={r.album.title}
              artistName={r.album.artist.name}
              rating={r.rating}
              genre="Pop"  // hard‑code for now, replace with r.album.genre later
              profilePic="/sample_images/profilePic.png" // placeholder
              displayName={r.user.username}
              userName={`@${r.user.username}`}
              hasReview={r.text.length > 0}
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