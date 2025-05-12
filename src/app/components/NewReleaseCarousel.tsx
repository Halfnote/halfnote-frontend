"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { NewReleases } from "../types/review";
import Clairo from "../../../public/sample_images/813adHqElhL.jpg";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

type ListCarouselProps = {
  items: NewReleases[];
};

export const NewReleasesCarousel = ({ items }: ListCarouselProps) => {
  return (
    <div className="w-full flex justify-center items-center">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="w-full max-w-[600px] h-[320px]"
      >
        {items.map((item, index) => (
          <SwiperSlide
            key={index}
            className="w-[250px] h-[250px] flex items-center justify-center rounded-lg overflow-hidden"
          >
            <img
              src="/sample_images/813adHqElhL.jpg" // or item.coverArtUrl
              alt={item.albumName}
              className="w-full h-full object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
