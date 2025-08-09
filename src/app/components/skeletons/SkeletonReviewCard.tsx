export const SkeletonReviewCard = () => {
  return (
    <div className="flex p-4 border border-black rounded-xl shadow-md bg-white gap-4 w-[600px] h-[250px] animate-pulse">
      {/* Album Cover Placeholder */}
      <div className="relative flex-shrink-0 w-[150px] h-[150px] border-[1px] border-black" />

      {/* Right Content */}
      <div className="flex flex-col justify-between flex-grow pr-3 w-full">
        {/* Rating badge */}
        <div className="self-end w-[40px] h-[40px] bg-gray-200 rounded-full" />

        <div className="flex flex-col gap-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="mt-2 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-[90%]" />
            <div className="h-3 bg-gray-200 rounded w-[80%]" />
            <div className="h-3 bg-gray-200 rounded w-[70%]" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <div className="w-[40px] h-[40px] rounded-full bg-gray-200 border border-black" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="w-[48px] h-[28px] bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};
