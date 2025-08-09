"use client";
import { useState } from "react";
import TimeButtonCycle from "../../TimeButton";

export const TopReviewsSection = () => {
  const [reviewTime, setReviewTime] = useState<string>("today");

  return (
    <div className="bg-white flex flex-col border-black rounded-xl border-2 p-6 w-3/5 h-[450px]">
      <div className="flex flex-row items-center justify-start">
        <h3 className="another-heading1 mr-2">Top Reviews</h3>
        <TimeButtonCycle time={reviewTime} setTime={setReviewTime} />
      </div>
      <div className="overflow-auto">
        {/* Add dynamic review content using user.username or access_token */}
      </div>
    </div>
  );
};
