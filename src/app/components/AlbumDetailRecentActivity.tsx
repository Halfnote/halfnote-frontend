import { Review } from "../types/types";
import Image from "next/image";

import { generateRatingStamp } from "../utils/calculations";

interface AlbumDetailRecentActivityProps {
  activity: Review;
}
export const AlbumDetailRecentActivity = ({
  activity,
}: AlbumDetailRecentActivityProps) => {
  return (
    <div
      key={activity.id}
      className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm mb-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src={activity.user_avatar}
            alt={activity.username}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h3 className="another-heading4">{activity.username}</h3>
            <h4 className="another-heading5 text-gray-400">{`@${activity.username}`}</h4>
          </div>
        </div>
        <Image
          width={75}
          height={75}
          src={generateRatingStamp(activity.rating)}
          alt={` Badge`}
        />
      </div>
    </div>
  );
};
