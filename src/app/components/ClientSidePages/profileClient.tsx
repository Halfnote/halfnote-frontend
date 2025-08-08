"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { Icons } from "@/app/icons/icons";
import { AlbumCard } from "@/app/components/AlbumCard";
import { AnotherNavButton } from "@/app/components/AnotherNavButton";
import ReviewCard from "@/app/components/ReviewCard";
import { useUser, useUserActivity, useUserReviews } from "@/app/hooks";
import { Genre, Review } from "@/app/types/types";
import { generateBadge, getVinylIcon } from "@/app/utils/calculations";
import Black from "../../../../public/sample_images/black.jpeg";
import { RecentActivityCard } from "../RecentActivityCard";
import { AlbumTile } from "../AlbumTile";
import { SkeletonReviewCard } from "../skeletons/SkeletonReviewCard";
import { SkeletonRecentActivityCard } from "../skeletons/SkeletonRecentActivityCard";
import { ProfilePageSkeleton } from "../skeletons/SkeletonProfilePage";

type ProfilePageProps = {
  user: {
    username: string;
    access_token: string;
  };
};

export default function ProfilePage({ user }: ProfilePageProps) {
  const checkMark = (
    <svg
      className="w-6 h-6 text-gray-800 dark:text-white inline "
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );

  const { data: userData, isPending: isPendingUser } = useUser();
  const { data: userReviews = [], isPending: isPendingReviews } =
    useUserReviews(user.username);
  const { data: userActivity = [], isPending: isPendingActivity } =
    useUserActivity(user.username);
  const [filter, setFilter] = useState<"reviewed" | "liked">("reviewed");

  const reviewedActivity = useMemo(
    () =>
      userActivity.filter(
        (activity) => activity.activity_type === "review_created"
      ),
    [userActivity]
  );

  const likedActivity = useMemo(
    () =>
      userActivity.filter(
        (activity) => activity.activity_type === "review_liked"
      ),
    [userActivity]
  );

  const pinnedReviews = useMemo(() => {
    const pinned = userReviews.filter((review: Review) => review.is_pinned);
    return pinned.map((review: Review) => {
      const correspondingActivity = userActivity.find(
        (activity) => activity.review_details?.id === review.id
      );

      if (correspondingActivity?.review_details) {
        return {
          ...review,
          is_liked_by_user:
            correspondingActivity.review_details.is_liked_by_user,
          likes_count: correspondingActivity.review_details.likes_count,
        };
      }

      return review;
    });
  }, [userReviews, userActivity]);

  if (isPendingUser || !userData) return <ProfilePageSkeleton />;
  return (
    <div className="flex flex-col border-black border-2 bg-white rounded-xl overflow-scroll pb-10 scale-90 max-h-[800px]">
      <div className="w-full h-60 relative z-0">
        <Image
          src={Black}
          alt="banner-image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-8 flex-grow relative">
        {/* Profile Info Sidebar */}
        <div className="col-span-2 flex flex-col items-center px-50">
          {/* Profile Picture */}
          <div className="w-[200px] h-[200px] -mt-20 border-2 border-black bg-white z-10 overflow-hidden relative flex-shrink-0 rounded-full">
            <Image
              src={userData.avatar || "/default-avatar.png"}
              alt="profile"
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center text-center mt-4 mb-10">
            <h1 className="another-heading1 text-[42px] mb-1">
              <span className="flex flex-row items-center gap-2">
                {userData.name}
                {userData.is_staff && checkMark}
              </span>
            </h1>

            <p className="another-heading5 mb-3">@{userData.display_name}</p>

            <p className="another-heading5 text-center mb-5 w-[280px]">
              {userData.bio}
            </p>

            <p className="another-heading5">📍{userData.location}</p>
          </div>

          {/* Stats */}
          <div className="flex flex-row gap-3 mb-3">
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <Image
                src={getVinylIcon(userData.review_count)}
                alt="Vinyl icon"
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
                <h3 className="another-heading5">Following</h3>
              </div>
            </div>
          </div>

          {/* Most Reviewed Genres */}
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

        {/* Main Content */}
        <div className="col-span-6 mt-3 px-10">
          {/* Favorite Albums */}
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
            <div className="flex flex-row gap-10 overflow-x-auto">
              {userData.favorite_albums?.slice(0, 3).map((fav) => (
                <AlbumCard
                  key={fav.id}
                  albumCover={fav.cover_url || "/default-album.png"}
                  albumName={fav.title}
                  artistName={fav.artist}
                  size={220}
                />
              ))}
              <AlbumTile albums={userData.favorite_albums?.slice(3)} />
            </div>
          </div>

          {/* Pinned Reviews */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={Icons.pin}
                alt="Pin Icon"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="another-heading1 text-[42px]">Pinned Reviews</h1>
            </div>
            <div className="flex flex-row gap-10 mb-10">
              {isPendingReviews ? (
                <>
                  <SkeletonReviewCard />
                  <SkeletonReviewCard />
                </>
              ) : (
                pinnedReviews.map((review: Review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    avatar={userData.avatar || "/default-avatar.png"}
                    username={user.username}
                  />
                ))
              )}
            </div>
          </div>
          <div className="w-full">
            {/* Header with buttons in same row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Image
                  src={Icons.hourGlass}
                  alt="Recent Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h1 className="another-heading1 text-[42px]">Recent</h1>
              </div>
              <div className="flex gap-4">
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
            </div>

            <div className="flex flex-col gap-4 max-h-[850px] overflow-y-auto pr-2">
              {isPendingActivity ? (
                [...Array(5)].map((_, index) => (
                  <SkeletonRecentActivityCard key={index} />
                ))
              ) : (
                <>
                  {filter === "reviewed" &&
                    reviewedActivity.map((activity) => (
                      <RecentActivityCard
                        key={activity.id}
                        albumCover={activity.review_details.album.cover_url}
                        albumTitle={
                          activity?.review_details?.album?.artist ?? "Unknown"
                        }
                        artistName={
                          activity?.review_details?.album?.artist ?? "Unknown"
                        }
                        rating={activity.review_details.rating}
                        hasReview={true}
                        time={activity.created_at}
                      />
                    ))}

                  {filter === "liked" &&
                    likedActivity.map((activity) => (
                      <RecentActivityCard
                        key={activity.id}
                        albumCover={activity.review_details.album.cover_url}
                        albumTitle={
                          activity?.review_details?.album?.artist ?? "Unknown"
                        }
                        artistName={
                          activity?.review_details?.album?.artist ?? "Unknown"
                        }
                        rating={activity.review_details.rating}
                        hasReview={true}
                        time={activity.created_at}
                      />
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
