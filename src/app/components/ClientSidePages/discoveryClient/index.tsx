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

export default function DiscoverPage({}: DiscoverPageProps) {
  return (
    <div className="static origin-top flex flex-row md:flex-row gap-4 box-border bg-[#f3f3f3] justify-center w-full text-2xl lg:text-4xl">
      {/* Left Sidebar */}
      <div className="w-2/5 flex flex-col gap-4 md:w-1/5 sm:w-2/5">
        <MembersSection />
        {/* Only show on mobile */}
        <div className="block md:hidden">
          <MostRecentReviewsSection />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 h-full w-3/5 md:w-3/5 sm:w-3/5">
        <div className="flex flex-col md:flex-row gap-4">
          <TopReviewsSection />
          <TopRatedAlbumsSection />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <OnThisDaySection />
          <NewReleasesSection />
        </div>
      </div>

      {/* Right Sidebar - only visible on desktop */}
      <div className="w-full md:w-1/5 hidden md:block">
        <MostRecentReviewsSection />
      </div>
    </div>
  );
}
