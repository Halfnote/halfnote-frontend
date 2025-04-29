"use client";
import Image from "next/image";
import { useState } from "react";
import { Icons } from "@/app/icons/icons";
import TimeButtonCycle from "./components/TimeButton";
import YearButtonCycle from "./components/YearButton";
import { Review } from "./types/review";
import { useEffect } from "react";
import ReviewCard from "./components/ReviewCard";
import { DateTime } from "luxon";

export default function DiscoverPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewTime, setReviewTime] = useState<string>("today");
  const [topRatedTime, setTopRatedTime] = useState<string>("today");
  const getReviews = async (setter: (value: Array<Review>) => void) => {
    try {
      const res = await fetch("/sample_data/reviews.json");

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch concerts");
      }

      const data = await res.json();
      setter(data["results"]);
    } catch (err) {
      console.error("Concert fetch error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getReviews(setReviews);
    };
    fetchData();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const created_at = DateTime.fromISO(review.created_at);
    const now = DateTime.now();

    if (reviewTime === "today") {
      return created_at.hasSame(now, "day");
    } else if (reviewTime === "this week") {
      return created_at.hasSame(now, "week");
    } else if (reviewTime === "this month") {
      return created_at.hasSame(now, "month");
    } else {
      return created_at.hasSame(now, "year");
    }
  });

  return (
    <div className="flex w-full h-screen gap-4 box-border bg-[#f3f3f3] overflow-hidden">
      <div className="flex flex-col items-center border-black border-2 rounded-xl p-6 w-[20%] bg-white">
        <h3 className="another-heading1">Members</h3>
      </div>
      <div className="flex flex-col flex-grow gap-4 min-h-0">
        <div className="flex gap-4">
          {/*top review*/}
          <div className="bg-white flex flex-col h-[450px] border-black rounded-xl border-2 p-6 w-[35em]">
            <div className="flex items-center justify-start mb-2">
              <h3 className="another-heading1 mr-2">Top Reviews</h3>
              <TimeButtonCycle time={reviewTime} setTime={setReviewTime} />
            </div>
            <div className="overflow-y-auto h-full">
              {filteredReviews?.map((review) => (
                <ReviewCard
                  key={review.id}
                  // coverArtUrl={review.album.cover_art_url}
                  reviewerName={review.user.username}
                  rating={review.rating}
                  reviewTitle={review.album.title}
                  artistName={review.album.artist.name}
                  reviewText={review.text}
                  createdAt={DateTime.fromISO(review.created_at).toFormat(
                    "dd LLL yyyy"
                  )}
                  likes={5}
                />
              ))}
            </div>
          </div>

          <div className="bg-white flex flex-col rounded-xl p-6 w-[35%] h-[450px] items-center border-black border-2">
            <div className="flex flex-col items-center mb-2 w-[166px]">
              <h3 className="another-heading1">Top Rated</h3>
              <TimeButtonCycle time={topRatedTime} setTime={setTopRatedTime} />
            </div>
          </div>
        </div>
        <div className="flex gap-4 flex-grow">
          <div className="bg-white flex flex-col border-black border-2 rounded-xl p-6 w-[35%]">
            <div className="flex flex-col b-2 items-center">
              <h3 className="another-heading1">On This Day</h3>
              <span className="flex flex-row ml-10 mr-10 items-center">
                <h3 className="another-heading1 mr-2">In</h3>
                <YearButtonCycle />
              </span>
            </div>
          </div>
          <div className="bg-white flex flex-col border-2 border-black rounded-xl p-6 w-[75%] justify-start">
            <h3 className="another-heading1">New Releases</h3>
          </div>
        </div>
      </div>
      <div className="bg-white flex flex-col text-center items-center border-black border-2 rounded-xl p-6 w-[20%]">
        <h3 className="another-heading1">Most Recent Reviews</h3>
      </div>
    </div>
  );
}
