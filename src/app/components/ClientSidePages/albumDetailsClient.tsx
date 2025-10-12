"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAlbumDetails } from "@/app/hooks";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import ReviewModal from "../ReviewModal";
import { Icons } from "../../icons/icons";
import { AlbumDetailRecentActivity } from "../AlbumDetailRecentActivity";
import { Review } from "@/app/types/types";
import Lorde from "../../../../public/sample_images/lorde.jpeg";
import { ProperReviewCard } from "./ProperReviewCard";
import { CreateAlbumListModal } from "../CreateAlbumListModal";
import useEmblaCarousel from "embla-carousel-react";
import { ExpandedReviewModal } from "./expandedReviewModal";
import { generateRatingStamp } from "@/app/utils/calculations";

type AlbumDetailsProps = {
  user: {
    username: string;
  };
};
const AlbumDetailsClient = ({ user }: AlbumDetailsProps) => {
  const params = useSearchParams();
  const discogsID = params.get("query");
  const {
    data: albumDetails = undefined,
    isLoading,
    isError,
  } = useAlbumDetails(discogsID || "");
  const [albumListModal, setAddAlbumListModal] = useState(false);
  const [writeReviewModal, setWriteReviewModal] = useState(false);
  const [expandModal, setExpandModal] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review>();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Setup listeners
  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (isLoading)
    return <p className="text-center mt-10">Loading album details...</p>;
  if (isError || !albumDetails)
    return (
      <p className="text-center mt-10 text-red-500">Error loading album.</p>
    );

  // lowercase as backend retrieves usernames as lowercase
  const alreadyReviewed = albumDetails.reviews.find(
    (review: Review) => review.username === user.username.toLowerCase()
  );

  const imageSrc =
    albumDetails.album.cover_url || albumDetails.album.cover_image;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4 lg:w-[100%]">
        {/* left side */}
        <div className="flex flex-col space-y-0 max-h-screen lg:col-span-1">
          {/* white box */}
          <div className="border-1 border-black rounded-xl bg-white max-w-sm overflow-hidden">
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
                onClick={() => setWriteReviewModal(true)}
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
                {/* defaulting to 1 for now, need to change */}
                <Image
                  width={80}
                  height={80}
                  src={generateRatingStamp(albumDetails.average_rating ?? 1, {
                    empty: false,
                    outTen: true,
                  })}
                  alt="Badge"
                />
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
                <div className="space-y-1 overflow-y-auto flex-1 max-h-48 =">
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

        <div className="space-y-5 pl-0 flex flex-row h-screen lg:col-span-3 gap-4">
          {/* Top Notes */}
          <div className="flex flex-col gap-4 w-[70%] h-full overflow-hidden">
            <div className="bg-white rounded-xl border-1 border-black p-5 min-h-[350px] ">
              <div className="flex items-center gap-3">
                <Image
                  src={Icons.trophy}
                  alt="Pin Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h2 className="another-heading1 text-4xl sticky">
                  Top Reviews
                </h2>
              </div>

              {albumDetails.reviews.length > 0 ? (
                <>
                  <div className="embla" ref={emblaRef}>
                    <div className="embla__container flex">
                      {albumDetails.reviews.map((review, index) => (
                        <div className="embla__slide px-2" key={index}>
                          <ProperReviewCard
                            review={review}
                            username={user.username}
                            setOpen={setExpandModal}
                            setSelected={setSelectedReview}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    {scrollSnaps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`w-3 h-3 rounded-full border-black border-2 ${
                          index === selectedIndex ? "bg-black" : "bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 another-heading5">
                  No reviews yet for this album.
                </p>
              )}
            </div>
            <div className="bg-white rounded-xl border-1 border-black p-5 flex-1 overflow-y-scroll">
              <div className="flex items-center gap-3 mb-2">
                <Image
                  src={Icons.hourGlass}
                  alt="Pin Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h1 className="another-heading1 text-4xl sticky">Activity</h1>
              </div>
              {albumDetails.reviews.length > 0 ? (
                albumDetails.reviews.map((activity) => (
                  <AlbumDetailRecentActivity
                    username={user.username}
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
          </div>

          <div className="flex flex-col gap-4 h-screen w-[30%]">
            <div className="bg-white rounded-xl border-1 border-black p-5 h-[50%] w-full relative overflow-hidden">
              <Image src={Lorde} alt="Lorde" fill className="object-cover" />
            </div>

            <div className="bg-white rounded-xl border-1 border-black p-5 h-full flex flex-col items-center relative">
              <div className="flex justify-center gap-3 mb-2">
                <Image
                  src={Icons.vinylStack}
                  alt="Pin Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h1 className="another-heading1 text-4xl">Album Lists</h1>
              </div>
              <button
                className="bg-black text-white p-2 rounded-full another-heading4 hover:bg-gray-50 hover:text-black border-1 hover:cursor-pointer transition-colors mt-3 w-[90%] mb-5 flex flex-row justify-center gap-3"
                onClick={() => setAddAlbumListModal((prev) => !prev)}
              >
                Add to List
              </button>
            </div>
          </div>
        </div>
      </div>
      {writeReviewModal && (
        <ReviewModal
          data={albumDetails.album}
          username={user.username}
          userReview={alreadyReviewed}
          setOpen={setWriteReviewModal}
        />
      )}
      {albumListModal && (
        <CreateAlbumListModal setOpen={setAddAlbumListModal} />
      )}
      {expandModal && (
        <ExpandedReviewModal
          setSelected={setSelectedReview}
          setOpen={setExpandModal}
          review={selectedReview}
          username={user.username}
        />
      )}
    </>
  );
};

export default AlbumDetailsClient;
