"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Icons } from "@/app/icons/icons";
import { Review } from "@/app/types/types";
import Image from "next/image";
import { generateRatingStamp, getTimeAgo } from "@/app/utils/calculations";

type ModalType = {
  setSelected: Dispatch<SetStateAction<Review | undefined>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  review: Review | undefined;
  username: string;
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
  console.log(review);
  return (
    review && (
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
                src={review.album_cover}
                alt={`${review.album_title} cover`}
                className="w-full object-cover mx-auto"
              />
            </div>
            <div className="items-center flex flex-col">
              <Image
                width={100}
                height={100}
                src={generateRatingStamp(review.rating, { outTen: true })}
                alt="Badge"
              />
              <h1 className="another-heading1 text-5xl line-clamp-2">
                {review.album_title}
              </h1>
              <div className="flex flex-row items-baseline space-x-3">
                <span className="italic text-gray-600 another-heading2">
                  by
                </span>
                <span className="another-heading4 text-gray-700">
                  {review.album_artist}
                </span>
              </div>
              <div className="flex flex-row gap-x-4">
                <Image
                  src={review.user_avatar}
                  alt={review.username}
                  width={50}
                  height={50}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex flex-col gap-y-0">
                  <h3 className="another-heading3 font-bold">
                    {review.username}
                  </h3>
                  <p className="another-heading5 text-gray-400">
                    @{review.username} {getTimeAgo(review.created_at)}
                  </p>
                </div>
              </div>
              <p className="another-heading5 overflow-y-scroll">
                {review.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
