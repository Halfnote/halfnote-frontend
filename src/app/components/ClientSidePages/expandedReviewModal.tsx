"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Icons } from "@/app/icons/icons";
import { Activity, Review } from "@/app/types/types";
import Image from "next/image";
import { generateRatingStamp, getTimeAgo } from "@/app/utils/calculations";

type ModalType = {
  setSelected: Dispatch<SetStateAction<Review | Activity | undefined>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  review: Review | Activity | undefined;
};

export const ExpandedReviewModal = ({
  setOpen,
  review,
  setSelected,
}: ModalType) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const isActivity = (item: Review | Activity): item is Activity => {
    return "review_details" in item;
  };

  const getData = () => {
    if (!review) return null;

    if (isActivity(review)) {
      console.log("ues");
      return {
        albumCover: review.review_details?.album.cover_url,
        albumTitle: review.review_details?.album.title,
        albumArtist: review.review_details?.album.artist,
        rating: review.review_details?.rating,
        content: review.review_details?.content,
        username: review.review_details?.user.username,
        userAvatar: review.review_details?.user.avatar,
        createdAt: review.created_at,
      };
    } else {
      return {
        albumCover: review.album_cover,
        albumTitle: review.album_title,
        albumArtist: review.album_artist,
        rating: review.rating,
        content: review.content,
        username: review.username,
        userAvatar: review.user_avatar,
        createdAt: review.created_at,
      };
    }
  };

  const data = getData();

  return (
    data && (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="p-4 border-1 border-gray-500 rounded-xl bg-white w-[75%] h-full relative">
          <div className="relative flex items-center p-4">
            <button
              className="another-heading6 absolute left-0 cursor-pointer flex flex-row gap-x-2"
              onClick={() => {
                setOpen(false);
                setSelected(() => undefined);
              }}
            >
              <Image src={Icons.backButton} width={20} height={20} alt="back" />
              Back
            </button>

            <h3 className="another-heading4 mx-auto">Album Review</h3>
          </div>

          {/* content */}
          <div className="grid grid-cols-2">
            <div className="w-[500px] h-[500px]">
              <Image
                width={500}
                height={500}
                src={data.albumCover || ""}
                alt={`${data.albumTitle} cover`}
                className="w-full object-cover mx-auto"
              />
            </div>
            <div className="items-center flex flex-col">
              <Image
                width={100}
                height={100}
                src={generateRatingStamp(data.rating, {
                  empty: false,
                  outTen: true,
                })}
                alt="Badge"
              />
              <h1 className="another-heading1 text-5xl">{data.albumTitle}</h1>
              <div className="flex flex-row items-baseline space-x-3">
                <span className="italic text-gray-600 another-heading2">
                  by
                </span>
                <span
                  style={{ fontWeight: "bold" }}
                  className="another-heading4 text-gray-700 mb-4"
                >
                  {data.albumArtist}
                </span>
              </div>
              <div className="flex flex-row gap-x-4 mb-4">
                <Image
                  src={data.userAvatar || ""}
                  alt={data.username}
                  width={50}
                  height={50}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex flex-col gap-y-0">
                  <h3 className="another-heading3 font-bold">
                    {data.username}
                  </h3>
                  <p className="another-heading5 text-gray-400">
                    @{data.username} {getTimeAgo(data.createdAt)}
                  </p>
                </div>
              </div>
              <p className="another-heading5 overflow-y-scroll">
                {data.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
