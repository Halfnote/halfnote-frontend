import React from "react";

export const SkeletonRecentActivityCard = () => {
  return (
    <div className="flex flex-row w-full border border-black rounded-2xl bg-white p-2 h-[100px] shadow-md animate-pulse">
      {/* Left half */}
      <div className="flex flex-row items-center justify-between w-1/2 pr-3">
        {/* Album art + info */}
        <div className="flex flex-row items-center">
          <div className="flex-shrink-0 w-[70px] h-[70px] rounded-[10px] bg-gray-300" />
          <div className="flex flex-col justify-center ml-4 space-y-2">
            <div className="w-24 h-4 bg-gray-300 rounded" />
            <div className="w-20 h-3 bg-gray-200 rounded" />
          </div>
        </div>
        {/* Score badge */}
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16">
          <div className="w-12 h-12 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Right half */}
      <div className="flex flex-row items-center w-1/2 pl-3">
        <div className="flex flex-row items-center w-1/2 pl-3 space-x-2">
          <div className="w-6 h-6 bg-gray-300 rounded" />
          <div className="w-16 h-4 bg-gray-200 rounded ml-auto" />
        </div>
      </div>
    </div>
  );
};
