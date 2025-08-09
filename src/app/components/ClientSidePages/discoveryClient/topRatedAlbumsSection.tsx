"use client";
import { useState } from "react";
import TimeButtonCycle from "../../TimeButton";
import { TopRatedCarousel } from "../../TopRatedCarousel";

export const TopRatedAlbumsSection = () => {
  const [topRatedTime, setTopRatedTime] = useState<string>("today");

  return (
    <div className="bg-white flex flex-col rounded-xl p-6 w-2/5 h-[450px] items-center border-black border-2">
      <div className="flex flex-col items-center">
        <h3 className="another-heading1 ">Top Rated</h3>
        <TimeButtonCycle time={topRatedTime} setTime={setTopRatedTime} />
      </div>
      <TopRatedCarousel items={[]} />
    </div>
  );
};
