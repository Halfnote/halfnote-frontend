"use client";
import { useState, use } from "react";
import TimeButtonCycle from "../TimeButton";
import YearButtonCycle from "../YearButton";
import { Review, TopRated } from "../../types/review";
import { useEffect } from "react";
import ReviewCard from "../ReviewCard";
import { DateTime } from "luxon";
import { TopRatedCarousel } from "../TopRatedCarousel";
import { MemberCard } from "../MemberCard";
import Actor from "../../../../public/sample_images/profilePic.png";
import Daft from "../../../../public/sample_images/daft.png";
import Charlie from "../../../../public/sample_images/charlie.png";
import Kid from "../../../../public/sample_images/kid.png";
import { RecentReview } from "../RecentReview";
import { NewReleasesCarousel } from "../NewReleaseCarousel";
import { OnThisDay } from "../OnThisDay";
export type UserReview = {
  id: number;
  username: string;
  rating: number;
  content: string;
  created_at: string;
};

export type UserReviewResponse = UserReview[];

interface DiscoverPageProps {
  userReviews: Promise<UserReviewResponse>;
}

export default function DiscoverPage({ userReviews }: DiscoverPageProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [topRated, setTopRated] = useState<TopRated[]>([]);
  const [reviewTime, setReviewTime] = useState<string>("today");
  const [topRatedTime, setTopRatedTime] = useState<string>("today");

  // FINALLY GETTING DATA streamed from server
  console.log(use(userReviews));

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
  const getTopRated = async (setter: (value: Array<TopRated>) => void) => {
    try {
      const res = await fetch("/sample_data/top_rated.json");

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch concerts");
      }

      const data = await res.json();
      const result: any[] = data["results"];
      const topRatedResults = result.map((item) => ({
        coverArtUrl: item.cover_art_url,
        artistName: item.artist.name,
        albumName: item.title,
      }));
      setter(topRatedResults);
    } catch (err) {
      console.error("Concert fetch error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getReviews(setReviews);
      await getTopRated(setTopRated);
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
    <div className="static origin-top flex flex-row gap-4 box-border bg-[#f3f3f3] items-center justify-center w-full scale-90">
      <div className="flex flex-col items-center border-black border-2 rounded-xl p-6 w-[275px] h-[916px] bg-white">
        <h3 className="another-heading1 text-[42px]">Members</h3>
        <div className="overflow-y-auto ">
          <MemberCard
            userName="Odi"
            numRatings={123}
            profilePic={Actor}
            topAlbums={[Daft, Charlie, Kid]}
          />
          <MemberCard
            userName="Anubhav"
            numRatings={1234}
            profilePic={Actor}
            topAlbums={[Daft, Charlie, Kid]}
          />
          <MemberCard
            userName="Connor"
            numRatings={1502}
            profilePic={Actor}
            topAlbums={[Daft, Charlie, Kid]}
          />
          <MemberCard
            userName="Connor"
            numRatings={1502}
            profilePic={Actor}
            topAlbums={[Daft, Kid, Charlie]}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 ">
          {/*top review*/}
          <div className="bg-white flex flex-col border-black rounded-xl border-2 p-6 w-[815px] h-[450px]">
            <div className="flex flex-row items-center justify-start">
              <h3 className="another-heading1 text-[42px] mr-2">Top Reviews</h3>
              <TimeButtonCycle time={reviewTime} setTime={setReviewTime} />
            </div>
            <div className="overflow-y-auto ">
              {filteredReviews?.map((review) => (
                <ReviewCard
                  coverArtUrl={Charlie}
                  key={review.id}
                  reviewerName={review.user.username}
                  rating={review.rating}
                  reviewTitle={review.album.title}
                  artistName={review.album.artist.name}
                  reviewText={review.text}
                  createdAt={DateTime.fromISO(review.created_at).toFormat(
                    "dd LLL yyyy"
                  )}
                  likes={5}
                  reviewerAvatarUrl={Actor}
                />
              ))}
            </div>
          </div>
          <div className="bg-white flex flex-col rounded-xl p-6 w-[275px] items-center border-black border-2">
            <div className="flex flex-col items-center">
              <h3 className="another-heading1 text-[42px]">Top Rated</h3>
              <TimeButtonCycle time={topRatedTime} setTime={setTopRatedTime} />
            </div>
            <TopRatedCarousel items={topRated} />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-white flex flex-col border-black border-2 rounded-xl p-6 w-[275px] h-[450px]">
            <div className="flex flex-col items-center">
              <h3 className="another-heading1 text-[42px]">On This Day</h3>
              <div className="flex flex-row items-center">
                <h3 className="another-heading1 text-[42px] mr-2">In</h3>
                <YearButtonCycle />
              </div>
              <OnThisDay artistImage={Actor} artistName="Name" />
            </div>
          </div>

          <div className="bg-white flex flex-col justify-between border-2 border-black rounded-xl p-6 w-[815px] h-[450px]">
            <h3 className="another-heading1 text-[42px] mb-4">New Releases</h3>
            <NewReleasesCarousel items={topRated} />
          </div>
        </div>
      </div>
      <div className="bg-white flex flex-col text-center items-center border-black border-2 rounded-xl p-6 h-[916px] w-[275px]">
        <h3 className="another-heading1 text-[42px]">Most Recent Reviews</h3>
        <RecentReview
          albumCover={Daft}
          rating={10}
          genre="Electronic"
          time={2}
        />
        <RecentReview albumCover={Charlie} rating={8} genre="Pop" time={3} />
        <RecentReview albumCover={Kid} rating={7} genre="Rock" time={5} />
      </div>
    </div>
  );
}
