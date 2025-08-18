"use client";
import { NewReleasesCarousel } from "../../NewReleaseCarousel";

export const NewReleasesSection = () => {
  return (
    <div className="bg-white flex flex-col justify-between border-2 border-black rounded-xl p-6 w-4/6 h-[450px]">
      <h3 className="another-heading1 mb-4">New Releases</h3>
      <NewReleasesCarousel items={[]} />
    </div>
  );
};
