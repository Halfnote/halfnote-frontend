"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Activity } from "../../types/types";
import { ActivityFilterType } from "@/app/lib/types/api";
import { useOthersActivity } from "@/app/hooks";
import { Icons } from "@/app/icons/icons";
import { ActivityFeedCard } from "./ActivityFeedCard";

type ActivityPageProps = {
  user: {
    username: string;
  };
};

type SortType = "recent" | "top";

export default function ActivityPage({ user }: ActivityPageProps) {
  const [sort, setSort] = useState<SortType>("recent");

  const { data: youActivity = [], isLoading: isLoadingYou } = useOthersActivity(
    user.username,
    ActivityFilterType.YOU
  );
  const { data: friendsActivity = [], isLoading: isLoadingFriends } =
    useOthersActivity(user.username, ActivityFilterType.FRIENDS);

  const isLoading = isLoadingYou || isLoadingFriends;

  const sortedActivities = useMemo(() => {
    const combined = [...youActivity, ...friendsActivity];
    const seen = new Set<number>();
    const unique = combined.filter((a: Activity) => {
      const key = a.review_details?.id ?? a.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const comparator =
      sort === "top"
        ? (a: Activity, b: Activity) =>
            (b.review_details?.rating ?? 0) - (a.review_details?.rating ?? 0)
        : (a: Activity, b: Activity) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime();

    return [...unique].sort(comparator);
  }, [youActivity, friendsActivity, sort]);

  return (
    <div className="flex flex-col border-black border-2 bg-white rounded-xl px-9 py-7 w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black">
        <h1 className="another-heading1 text-[38px] flex items-center gap-3">
          <Image src={Icons.star} alt="star" width={28} height={28} />
          Activity
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setSort("recent")}
            className={`flex items-center gap-2 border border-black rounded-full px-4 h-10 text-sm transition-colors cursor-pointer ${
              sort === "recent"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            <Image
              src={Icons.hourGlass}
              alt="hourglass"
              width={16}
              height={16}
              className={sort === "recent" ? "invert" : ""}
            />
            <span className="another-heading5">Recent</span>
          </button>
          <button
            onClick={() => setSort("top")}
            className={`flex items-center gap-2 border border-black rounded-full px-4 h-10 text-sm transition-colors cursor-pointer ${
              sort === "top"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            <Image
              src={Icons.trophy}
              alt="trophy"
              width={16}
              height={16}
              className={sort === "top" ? "invert" : ""}
            />
            <span className="another-heading5">Top</span>
          </button>
        </div>
      </div>

      {/* Activity list */}
      <div className="overflow-y-auto min-h-[550px] max-h-[700px] divide-y divide-black">
        {isLoading && (
          <p className="text-gray-500 italic py-6">Loading activity...</p>
        )}
        {!isLoading && sortedActivities.length === 0 && (
          <p className="text-gray-500 italic py-6">No activity found.</p>
        )}
        {sortedActivities.map((activity: Activity) => (
          <ActivityFeedCard
            key={activity.id}
            activity={activity}
            currentUsername={user.username}
          />
        ))}
      </div>
    </div>
  );
}
