"use client";
import React, { useEffect } from "react";
import {
  useAlbumDetails,
  userOthersActivity,
  useUserActivity,
} from "@/app/hooks";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import RatingBadge from "../ratingBadge";
import ReviewModal from "../ReviewModal";
import { Icons } from "../../icons/icons";
import { useToggleReview } from "@/app/hooks";
import { AlbumDetailRecentActivity } from "../AlbumDetailRecentActivity";
import { Review } from "@/app/types/types";

type AlbumDetailsProps = {
  user: {
    username: string;
    access_token: string;
  };
};
const AlbumDetailsClient = ({ user }: AlbumDetailsProps) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const discogsID = params.get("query");
  const show = params.get("show");
  const { toggleLikeMutation, isPending } = useToggleReview(user.username);
  // const { data: followingActivity = [] } = userOthersActivity(
  //   user.username,
  //   "incoming"
  // );

  const {
    data: albumDetails = undefined,
    isLoading,
    isError,
  } = useAlbumDetails(discogsID || "");
  console.log("ALBUM DETAILS: ", albumDetails);

  const handleOpenModal = () => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("show", "true");
    router.push(`${pathname}?${newParams.toString()}`);
  };

  useEffect(() => {
    if (show === "true") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [show]);

  if (isLoading)
    return <p className="text-center mt-10">Loading album details...</p>;
  if (isError || !albumDetails)
    return (
      <p className="text-center mt-10 text-red-500">Error loading album.</p>
    );

  const alreadyReviewed = albumDetails.reviews.find(
    (review: Review) => review.username === user.username
  );
  const imageSrc =
    albumDetails.album.cover_url || albumDetails.album.cover_image;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:w-screen h-screen mb-5 scale-90">
        {/* left side */}
        <div className="lg:col-span-1 flex flex-col space-y-0 max-h-screen">
          {/* white box */}
          <div className="border-1 border-black rounded-xl bg-white h-screen max-w-sm overflow-hidden">
            {typeof imageSrc === "string" && (
              <Image
                src={imageSrc}
                width={1000}
                height={1000}
                alt={`${albumDetails.album.title} cover`}
                className="w-full object-cover shadow-md rounded-tl-xl rounded-tr-xl mx-auto"
              />
            )}
            <div className="text-center">
              <h1
                className="another-heading1 text-[42px] leading-tight"
                style={{ fontWeight: "bolder" }}
              >
                {albumDetails.album.title}
              </h1>
              <p className="another-heading5 mt-[-10px]">
                {albumDetails.album.artist}
              </p>
              <p className="another-heading6 mt-0 text-gray-500">
                {albumDetails.album.year}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                className="bg-black text-white p-2 rounded-full another-heading4 hover:bg-gray-50 hover:text-black border-1 hover:cursor-pointer transition-colors mt-3 w-[80%] mb-5 flex flex-row justify-center gap-3"
                onClick={handleOpenModal}
              >
                <Image
                  src={Icons.pencil}
                  alt="Edit Icon"
                  width={30}
                  height={30}
                  className="object-contain"
                />
                {alreadyReviewed ? "Edit Review" : "Write Review"}
              </button>
            </div>
            <hr className="mb-5" />
            {/* review section */}
            <div className="flex flex-row items-center justify-between px-12">
              <span className="flex flex-col items-center">
                <h1 className="font-bold another-heading4">
                  {albumDetails.review_count}
                </h1>
                <p className="another-heading6">
                  {albumDetails.review_count === 1 ? "Review" : "Reviews"}
                </p>
              </span>
              <span className="flex flex-col items-center">
                <p className="font-bold another-heading5">avg.score</p>
                <p className="another-heading6">
                  {albumDetails.average_rating}/10
                </p>
              </span>
            </div>
            <hr className="mt-5" />

            {/* Tracklist inside white box */}
            {albumDetails.album.tracklist && (
              <div className="px-4 pb-4 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-3 flex-shrink-0">
                  <h3 className="another-heading2 font-bold">Tracklist</h3>
                  <span className="another-heading6 text-gray-500">
                    {albumDetails.album.tracklist?.length} songs
                  </span>
                </div>
                <div className="space-y-1 overflow-y-auto flex-1 max-h-48">
                  {albumDetails.album.tracklist?.map((track, index) => (
                    <div
                      key={`${track.position}-${track.title}-${index}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="another-heading6">
                        {track.position} {track.title}
                      </span>
                      {track.duration && (
                        <span className="text-gray-500 another-heading6">
                          {track.duration}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* white box end*/}
        </div>

        {/* Right Panel: Tracklist and Credits */}
        <div className="lg:col-span-3 space-y-5 pl-0 flex flex-col h-screen">
          {/* Top Notes */}
          <div className="bg-white rounded-xl border-1 border-black p-5 min-h-[290px]">
            <h2 className="another-heading1 text-4xl mb-2">Top Notes</h2>
            {albumDetails.reviews.length > 0 ? (
              <div>
                {albumDetails.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border-1 border-gray-500 rounded-xl  bg-white w-100 h-40 relative"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={review.user_avatar}
                          alt={review.username}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="another-heading4">
                          {review.username}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        <RatingBadge rating={review.rating} />
                      </span>
                    </div>
                    <p className="font-light text-xl truncate">
                      {review.content}
                    </p>
                    <button
                      disabled={isPending}
                      onClick={() => toggleLikeMutation.mutate(review.id)}
                      className={`absolute bottom-4 right-4 flex items-center justify-center gap-1 border border-black rounded-full bg-[#f4f4f4] text-sm text-black w-12 h-7 transition-opacity duration-200 ${
                        isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:cursor-pointer"
                      }`}
                    >
                      <Image
                        src={
                          review.is_liked_by_user
                            ? Icons.likedHeart
                            : Icons.unlikedHeart
                        }
                        alt="Favorite Icon"
                        width={12}
                        height={12}
                        className="object-contain"
                      />
                      <span className="text-[13px] font-medium">
                        {review.likes_count}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 another-heading5">
                No reviews yet for this album.
              </p>
            )}
          </div>
          <div className="flex flex-row gap-4 h-screen">
            {/* Recent Activity - 60% width */}
            <div className="bg-white rounded-xl border-1 border-black p-5 w-[60%] h-full">
              {/* We are down */}
              <h1 className="another-heading1 text-4xl">Recent Activity</h1>
              {albumDetails.reviews.length > 0 ? (
                albumDetails.reviews.map((activity) => (
                  <AlbumDetailRecentActivity
                    activity={activity}
                    key={activity.id}
                  />
                ))
              ) : (
                <p className="text-gray-500 another-heading5">
                  No recent activity yet for this album.
                </p>
              )}
            </div>

            {/* Album Lists - 40% width */}
            <div className="bg-white rounded-xl border-1 border-black p-5 w-[40%] h-full">
              <h1 className="another-heading1 text-4xl">Album Lists</h1>
            </div>
          </div>
        </div>
      </div>
      {show === "true" && (
        <ReviewModal
          data={albumDetails.album}
          username={user.username}
          userReview={alreadyReviewed}
        />
      )}
    </>
  );
};

export default AlbumDetailsClient;
