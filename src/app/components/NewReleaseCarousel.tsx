"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { NewReleases } from "../types/reviews";
import Image from "next/image";
import Clairo from "../../../public/sample_images/813adHqElhL.jpg";

import "swiper/css";
import "swiper/css/effect-coverflow";

type ListCarouselProps = {
  items: NewReleases[];
};

export const NewReleasesCarousel = ({ items }: ListCarouselProps) => {
  return (
    <Swiper
      modules={[EffectCoverflow]}
      effect="coverflow"
      loop={false}
      spaceBetween={10}
      slidesPerView={7}
      centeredSlides={true}
      grabCursor={true}
      coverflowEffect={{
        rotate: 15,
        slideShadows: false,
        depth: 200,
        stretch: 2,
      }}
      className="max-w-[750px] h-full relative"
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          {({ isActive, isPrev, isNext }) => {
            let overlayOpacity = 0.4;
            if (isActive) overlayOpacity = 0;
            else if (isPrev || isNext) overlayOpacity = 0.2;
            else overlayOpacity = 0.2;

            return (
              <div className="relative w-[245px] h-full flex flex-col items-center">
                <div className="relative w-[245px] h-[245px]">
                  <Image
                    src={Clairo}
                    alt={item.albumName}
                    width={245}
                    height={245}
                    className="object-cover border-2 border-black"
                  />
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-white pointer-events-none transition-opacity duration-300"
                    style={{ opacity: overlayOpacity }}
                  />
                </div>

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
            );
          }}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
