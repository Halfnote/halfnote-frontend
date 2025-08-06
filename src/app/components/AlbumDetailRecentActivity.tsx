import { Activity, Review } from "../types/types";
import Image from "next/image";
import RatingBadge from "./ratingBadge";
import { CountryBadge } from "../icons/stamps";
import { generateBadge, generateRatingStamp } from "../utils/calculations";
import { act } from "react";

interface AlbumDetailRecentActivityProps {
  activity: Review;
}
export const AlbumDetailRecentActivity = ({
  activity,
}: AlbumDetailRecentActivityProps) => {
  // const handleActivityType = (activity: Activity) => {
  //   switch (activity.activity_type) {
  //     case "comment_created":
  //       return (
  //         <h1 className="another-heading5 text-gray-400">{`${activity.user.username} commented on your review`}</h1>
  //       );
  //     case "review_created":
  //       return (
  //         <Image
  //           width={75}
  //           height={75}
  //           src={generateRatingStamp(activity.review_details?.rating)}
  //           alt={` Badge`}
  //         />
  //       );
  //     case "review_liked":
  //       return (s
  //         <h1 className="another-heading5 text-gray-400">{`${activity.user.username} liked your review`}</h1>
  //       );
  //     case "review_pinned":
  //       <h1 className="another-heading5 text-gray-400">{`${activity.user.username} pinned your review`}</h1>;
  //   }
  // };
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
