"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { NewReleases } from "../types/review";
import Image from "next/image";
import Clairo from "../../../public/sample_images/813adHqElhL.jpg";
import { SwiperOptions } from "swiper/types";

import "swiper/css";
import "swiper/css/effect-coverflow";

type ListCarouselProps = {
  items: NewReleases[];
};

export const NewReleasesCarousel = ({ items }: ListCarouselProps) => {
  return (
    <div className="w-full flex justify-center items-center">
      <Swiper
        modules={[EffectCoverflow]}
        effect={"coverflow"}
        loop={true}
        spaceBetween={10}
        slidesPerView={7}
        pagination={{ clickable: true }}
        centeredSlides={true}
        grabCursor={true}
        coverflowEffect={{
          rotate: 15,
          slideShadows: false,
          depth: 200,
          stretch: 2,
        }}
        className="w-[90%]"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            {({ isActive }) => (
              <div className="relative w-[245px] h-full">
                <Image
                  src={Clairo}
                  alt={item.albumName}
                  className={`object-cover border-2 ${
                    isActive ? "border-red-400" : "border-black"
                  }`}
                />
                {isActive && (
                  <div className="w-full text-center">
                    <h1 className="another-top-rated-album whitespace-nowrap">
                      {item.albumName}
                    </h1>
                    <h2 className="another-heading4 whitespace-nowrap">
                      {item.artistName}
                    </h2>
                  </div>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
