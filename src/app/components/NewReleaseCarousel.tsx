"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { NewReleases } from "../types/review";
import Image from "next/image";
import Clairo from "../../../public/sample_images/813adHqElhL.jpg";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

type ListCarouselProps = {
  items: NewReleases[];
};

export const NewReleasesCarousel = ({ items }: ListCarouselProps) => {
  return (
    <Swiper
      modules={[EffectCoverflow]}
      effect={"coverflow"}
      loop={false}
      spaceBetween={10}
      slidesPerView={7}
      centeredSlides={true}
      grabCursor={true}
      // pagination={{
      //   type: "bullets",
      //   clickable: true,
      //   renderBullet: function (index, className) {
      //     return `<span class="${className} custom-bullet"></span>`;
      //   },
      // }}
      coverflowEffect={{
        rotate: 15,
        slideShadows: false,
        depth: 200,
        stretch: 2,
      }}
      className="max-w-[750px] h-full relative"
    >
      {items.map((item, index) => (
        <SwiperSlide key={index} className="flex justify-center items-center">
          {({ isActive }) => (
            <div className="relative w-[245px] h-full flex flex-col items-center">
              <Image
                src={Clairo}
                alt={item.albumName}
                className={`object-cover border-2 border-black ${
                  isActive ? "opacity-100" : "opacity-50"
                }`}
                width={245}
                height={245}
              />
              {isActive && (
                <div className="w-full text-center mt-5 mb-6">
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
  );
};
