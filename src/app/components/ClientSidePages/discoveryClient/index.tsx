"use client";
import { MembersSection } from "./membersSection";
import { TopReviewsSection } from "./topReviewsSection";
import { TopRatedAlbumsSection } from "./topRatedAlbumsSection";
import { OnThisDaySection } from "./onThisDaySection";
import { NewReleasesSection } from "./newReleasesSection";
import { MostRecentReviewsSection } from "./mostRecentReviewsSection";

type DiscoverPageProps = {
  user: {
    username: string;
  };
};

export default function DiscoverPage({ user }: DiscoverPageProps) {
  return (
    <div className="static origin-top flex flex-row gap-4 box-border bg-[#f3f3f3] items-center justify-center w-full lg:text-5xl md:text-4xl">
      {/* Left Sidebar */}
      <div className="w-1/5">
        <MembersSection />
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 h-full w-3/5">
        <div className="flex gap-4">
          {/* Top Reviews */}
          <TopReviewsSection />

          {/* Top Rated Albums */}
          <TopRatedAlbumsSection />
        </div>

        {/* Bottom Section */}
        <div className="flex gap-4">
          {/* On This Day */}
          <OnThisDaySection />

          {/* New Releases */}
          <NewReleasesSection />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-1/5">
        <MostRecentReviewsSection />
      </div>
    </div>
  );
}
