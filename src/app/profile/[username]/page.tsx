"use client";
import { use, useEffect } from "react";
import Image from "next/image";
import { Icons } from "@/app/icons/icons";
import {
  ClassicalBadge,
  CountryBadge,
  PopBadge,
  RockBadge,
} from "@/app/icons/stamps";
import { AlbumCard } from "@/app/components/AlbumCard";
import { useParams } from "next/navigation";
import Black from "../../../../public/sample_images/black.jpeg";
import { getVinylIcon } from "@/app/utils/calculations";
import ReviewCard from "@/app/components/ReviewCard";
import { useUser, useUserActivity } from "@/app/hooks";
import { useUserReviews } from "@/app/hooks";
import { Genre, Review } from "@/app/types/types";
import { generateBadge } from "@/app/utils/calculations";
import { useState } from "react";
import { AnotherNavButton } from "@/app/components/AnotherNavButton";
import { RecentReviewCard } from "@/app/components/RecentReviewCard";

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const { data: userData } = useUser();
  const { data: userReviews = [] } = useUserReviews(params.username);
  const { data: userActivity = [] } = useUserActivity(params.username);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"reviewed" | "liked">("reviewed");

  useEffect(() => {
    setReviews(userReviews);
  }, [userReviews, userActivity]);

  console.log(userActivity);
  if (!userData) return <div>Loading...</div>;

  const pinnedReviews = reviews.filter((review: Review) => review.is_pinned);
  const reviewedActivity = userActivity.filter(
    (activity) => activity.activity_type === "review_created"
  );

  const likedActivity = userActivity.filter(
    (activity) => activity.activity_type === "review_liked"
  );
  console.log(likedActivity[0].review_details.album.cover_url);

  console.log("revL: ", reviewedActivity);
  console.log("liked: ", likedActivity);
  return (
    <div className="flex flex-col border-black border-2 bg-white w-full rounded-xl overflow-hidden pb-10">
      {/* Banner */}
      <div className="w-full h-60 relative z-0">
        <Image
          src={Black}
          alt="banner-image"
          className="w-full h-full object-fit"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-8 flex-grow relative">
        {/* First col: bio stuff */}
        <div className="col-span-2 flex flex-col items-center px-50">
          {/* Profile picture pulled up and layered */}
          <div className="w-[200px] h-[200px] rounded-full overflow-hidden -mt-30 border-2 border-black bg-white shrink-0">
            <Image
              src={userData.avatar || "/default-avatar.png"}
              alt="profile"
              width={200}
              height={200}
              className="object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
          </div>

          <div className="flex flex-col items-center text-center mt-4 mb-10">
            <h1 className="another-heading1 text-[42px] -mb-2">
              {userData.name}
            </h1>
            <p className="another-heading5 mb-3">@{userData.display_name}</p>
            <p className="another-heading5 text-center mb-5 w-70">
              {userData.bio}
            </p>
            <p className="another-heading5">📍{userData.location}</p>
          </div>

          {/* Review and Followers */}
          <div className="flex flex-row gap-3 mb-3">
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <Image
                src={getVinylIcon(userData.review_count)}
                alt="Fifth vinyl"
                className="aspect-square w-[54px] object-cover rounded-full ring-2"
              />
              <div>
                <h1 className="another-heading4">{userData.review_count}</h1>
                <h3 className="another-heading5">Reviews</h3>
              </div>
            </div>
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <div>
                <h1 className="another-heading4">{userData.follower_count}</h1>
                <h3 className="another-heading5">Followers</h3>
              </div>
              <div>
                <h1 className="another-heading4">{userData.following_count}</h1>
                <h3 className="another-heading5">Followers</h3>
              </div>
            </div>
          </div>

          {/* Most reviewed genres */}
          <div className="w-63 h-full rounded-md border-1 border-black flex-col flex items-center text-center">
            <h1 className="another-heading2 mt-3 mb-2">Most Reviewed Genres</h1>
            {userData.most_reviewed_genres?.map((genre: Genre) => (
              <div className="mb-3" key={genre.id}>
                <Image
                  width={100}
                  height={100}
                  src={generateBadge(genre.name)}
                  alt={`${genre.name} badge`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Second col: the rest */}
        <div className="col-span-6 50 mt-3 px-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={Icons.star}
                alt="Favorite Icon"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="another-heading1 text-[42px]">Favorite Albums</h1>
            </div>
            <div className="flex flex-row gap-10 overflow-y-auto">
              {userData.favorite_albums?.map((fav) => (
                <AlbumCard
                  key={fav.id}
                  albumCover={fav.cover_url || "/default-album.png"}
                  albumName={fav.title}
                  artistName={fav.artist}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={Icons.pin}
                alt="Favorite Icon"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="another-heading1 text-[42px]">Pinned Reviews</h1>
            </div>
            <div className="flex flex-row gap-10 mb-10">
              {pinnedReviews.map((review: Review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  setReviews={setReviews}
                  avatar={userData.avatar || "/default-avatar.png"}
                  username={params.username}
                />
              ))}
            </div>
            <div className="w-full border-black border rounded-xl px-20 py-10 relative">
              <h1 className="another-heading1 text-[42px]">Halfnote feed</h1>
              <div className="absolute top-10 right-10 flex gap-4">
                <AnotherNavButton
                  label="Reviewed"
                  onClick={() => setFilter("reviewed")}
                  isSelected={filter === "reviewed"}
                />
                <AnotherNavButton
                  label="Liked"
                  onClick={() => setFilter("liked")}
                  isSelected={filter === "liked"}
                />
              </div>

              <div className="mt-14 flex flex-col gap-4 max-h-[850px] overflow-y-scroll pr-2">
                {filter === "reviewed" &&
                  reviewedActivity.map((activity) => (
                    <RecentReviewCard
                      key={activity.id}
                      albumCover={activity.review_details.album.cover_url}
                      albumTitle={
                        activity.review_details.content.slice(0, 20) + "..."
                      }
                      artistName={activity.user?.username ?? "Unknown"}
                      rating={activity.review_details.rating}
                      genre={
                        activity.review_details.user_genres?.[0]?.name ??
                        "Electronic"
                      }
                      hasReview={true}
                      profilePic={activity.user.avatar ?? "/default-avatar.png"}
                      displayName={activity.user?.username ?? "Unknown"}
                      userName={"@" + (activity.user?.username ?? "unknown")}
                      time={new Date(activity.created_at).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        }
                      )}
                    />
                  ))}

                {filter === "liked" &&
                  likedActivity.map((activity) => (
                    <RecentReviewCard
                      key={activity.id}
                      albumCover={activity.review_details.album.cover_url}
                      albumTitle={
                        activity.review_details.content.slice(0, 20) + "..."
                      }
                      artistName={activity.target_user?.username ?? "Unknown"}
                      rating={activity.review_details.rating}
                      genre={
                        activity.review_details.user_genres?.[0]?.name ??
                        "Electronic"
                      }
                      hasReview={true}
                      profilePic={activity.user.avatar ?? "/default-avatar.png"}
                      displayName={activity.user.username ?? "Unknown"}
                      userName={"@" + (activity.user?.username ?? "unknown")}
                      time={new Date(activity.created_at).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        }
                      )}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
