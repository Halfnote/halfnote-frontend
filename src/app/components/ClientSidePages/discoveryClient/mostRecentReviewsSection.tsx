"use client";
import { albums } from "../../mockdata/mockClients";
import { RecentReview } from "../../RecentReview";

export const MostRecentReviewsSection = () => {
  return (
    <div className="bg-white flex flex-col text-center items-center border-black border-2 rounded-xl p-6 w-full h-[916px] overflow-auto">
      <h3 className="another-heading1">Most Recent Reviews</h3>
      <RecentReview
        albumCover={albums[0]}
        rating={10}
        genre="Electronic"
        time={2}
      />
      <RecentReview albumCover={albums[1]} rating={8} genre="Pop" time={3} />
      <RecentReview albumCover={albums[2]} rating={7} genre="Rock" time={5} />
    </div>
  );
};
