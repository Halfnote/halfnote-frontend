"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Icons } from "@/app/icons/icons";
import { Title } from "@/app/components/general/Title";
import { AlbumCard } from "@/app/components/AlbumCard";
import { AnotherNavButton } from "@/app/components/AnotherNavButton";
import ReviewCard from "@/app/components/ReviewCard";
import { useUser, useUserActivity, useUserReviews } from "@/app/hooks";
import { Activity, Genre, Review } from "@/app/types/types";
import { generateBadge, getVinylIcon } from "@/app/utils/calculations";
import Black from "../../../../public/sample_images/black.jpeg";
import { RecentActivityCard } from "../RecentActivityCard";
import { AlbumTile } from "../AlbumTile";
import { SkeletonReviewCard } from "../skeletons/SkeletonReviewCard";
import { SkeletonRecentActivityCard } from "../skeletons/SkeletonRecentActivityCard";
import { ProfilePageSkeleton } from "../skeletons/SkeletonProfilePage";
import { EditProfileModal } from "./editProfileModal";
import { ExpandedReviewModal } from "./expandedReviewModal";

type ProfilePageProps = {
  user: {
    username: string;
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
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [chosenReview, setChosenReview] = useState<
    Review | Activity | undefined
  >(undefined);

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
    return userReviews.filter((review: Review) => review.is_pinned);
  }, [userReviews]);

  if (isPendingUser) return <ProfilePageSkeleton />;

  return (
    <div className="flex flex-col border-black border-2 bg-white rounded-xl overflow-scroll pb-10 max-h-[800px]">
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
          <div className="w-[250px] h-[250px] -mt-30 border-2 border-black bg-white z-10 overflow-hidden relative flex-shrink-0 rounded-full">
            <Image
              src={userData?.avatar || "/default-avatar.png"}
              alt="profile"
              fill
              className="object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center text-center mb-10">
            {/* first three */}
            <div className="flex flex-col items-center w-full ">
              <span className="flex flex-row items-center align-baseline gap-2">
                <h1 className="another-heading1 text-[42px]">
                  {userData?.name || ""}
                </h1>
                {userData?.is_staff && checkMark}
              </span>
              <p className="another-heading5">@{userData?.display_name}</p>
              <button
                className="bg-black text-white p-2 rounded-full another-heading4 hover:bg-gray-50 hover:text-black border-1 hover:cursor-pointer transition-colors w-[80%] flex flex-row justify-center gap-3 mb-4 mt-4"
                onClick={() => setEditProfileModal((prev) => !prev)}
              >
                <Image
                  src={Icons.pencil}
                  alt="Edit Icon"
                  width={30}
                  height={30}
                  className="object-contain"
                />
                Edit Profile
              </button>
            </div>

            {/* last two  */}
            <div className="flex flex-col items-center w-full">
              <p className="another-heading5 text-center w-[280px]">
                {userData?.bio}
              </p>

              <p className="another-heading5">📍{userData?.location}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-row gap-3 mb-3">
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <Image
                src={getVinylIcon(userData?.review_count)}
                alt="Vinyl icon"
                className="aspect-square w-[54px] object-cover rounded-full ring-2"
              />
              <div>
                <h1 className="another-heading4">{userData?.review_count}</h1>
                <h3 className="another-heading5">Reviews</h3>
              </div>
            </div>
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <div>
                <h1 className="another-heading4">{userData?.follower_count}</h1>
                <h3 className="another-heading5">Followers</h3>
              </div>
              <div>
                <h1 className="another-heading4">
                  {userData?.following_count}
                </h1>
                <h3 className="another-heading5">Following</h3>
              </div>
            </div>
          </div>

          {/* Most Reviewed Genres */}
          <div className="w-63 h-full rounded-md border-1 border-black flex-col flex items-center text-center">
            <h1 className="another-heading2 mt-3 mb-2">Most Reviewed Genres</h1>
            {userData?.most_reviewed_genres?.map((genre: Genre) => (
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
            <div className="flex items-center gap-3">
              <div className="flex row justify-between w-full">
                <Title
                  src={Icons.star}
                  alt={"Favorite Icon"}
                  name={"Favorite Albums"}
                />
              </div>
            </div>

            {userData?.favorite_albums?.length ? (
              <div className="flex flex-row gap-10 overflow-x-clip">
                {userData.favorite_albums.slice(0, 3).map((fav) => (
                  <AlbumCard
                    key={fav.id}
                    albumCover={fav.cover_url || "/default-album.png"}
                    albumName={fav.title}
                    artistName={fav.artist}
                    size={200}
                  />
                ))}
                <AlbumTile albums={userData.favorite_albums.slice(3)} />
              </div>
            ) : (
              <p className="text-gray-500 italic mt-2">
                No favorite albums yet.
              </p>
            )}
          </div>

          {/* Pinned Reviews */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Title src={Icons.pin} alt={"Pin Icon"} name={"Pinned Reviews"} />
            </div>

            {isPendingReviews ? (
              <div className="flex flex-row gap-10 mb-10">
                <SkeletonReviewCard />
                <SkeletonReviewCard />
              </div>
            ) : pinnedReviews.length ? (
              <div className="flex flex-row gap-10 mb-10">
                {pinnedReviews.map((review: Review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    avatar={userData?.avatar || "/default-avatar.png"}
                    username={user.username}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mt-2">
                No pinned reviews yet.
              </p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Title
                  src={Icons.hourGlass}
                  alt={"Recent Icon"}
                  name={"Recent"}
                />
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

            {isPendingActivity ? (
              [...Array(5)].map((_, index) => (
                <SkeletonRecentActivityCard key={index} />
              ))
            ) : filter === "reviewed" && reviewedActivity.length ? (
              reviewedActivity.map((activity) => (
                <div
                  className={`mb-2 ${
                    activity.review_details.content.length > 0 &&
                    "cursor-pointer"
                  }`}
                  key={activity.id}
                  onClick={() => {
                    if (activity.review_details.content.length > 0) {
                      setChosenReview(activity);
                      setOpenReview(true);
                    }
                  }}
                >
                  <RecentActivityCard
                    key={activity.id}
                    albumCover={activity.review_details.album.cover_url}
                    albumTitle={
                      activity?.review_details?.album?.title ?? "Unknown"
                    }
                    artistName={
                      activity?.review_details?.album?.artist ?? "Unknown"
                    }
                    rating={activity.review_details.rating}
                    hasReview={activity.review_details.content.length > 0}
                    time={activity.created_at}
                  />
                </div>
              ))
            ) : filter === "liked" && likedActivity.length ? (
              likedActivity.map((activity) => (
                <div
                  className={`mb-2 ${
                    activity.review_details.content.length > 0 &&
                    "cursor-pointer"
                  }`}
                  key={activity.id}
                  onClick={() => {
                    if (activity.review_details.content.length > 0) {
                      setChosenReview(activity);
                      setOpenReview(true);
                    }
                  }}
                >
                  <RecentActivityCard
                    key={activity.id}
                    albumCover={activity.review_details.album.cover_url}
                    albumTitle={
                      activity?.review_details?.album?.title ?? "Unknown"
                    }
                    artistName={
                      activity?.review_details?.album?.artist ?? "Unknown"
                    }
                    rating={activity.review_details.rating}
                    hasReview={activity.review_details.content.length > 0}
                    time={activity.created_at}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No recent activity yet.</p>
            )}
          </div>
        </div>
      </div>
      {editProfileModal && <EditProfileModal setOpen={setEditProfileModal} />}
      {openReview && (
        <ExpandedReviewModal
          review={chosenReview}
          setSelected={setChosenReview}
          setOpen={setOpenReview}
        />
      )}
    </div>
  );
}
