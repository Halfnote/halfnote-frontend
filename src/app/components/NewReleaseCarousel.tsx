"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { NewReleases } from "../types/review";
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
      effect={"coverflow"}
      loop={true}
      spaceBetween={20}
      slidesPerView={7}
      pagination={{ clickable: true }}
      centeredSlides={true}
      grabCursor={true}
      coverflowEffect={{ rotate: 0, slideShadows: false }}
      className="w-full h-auto"
    >
      {items.map((item, index) => (
        <SwiperSlide key={index} className="flex items-center justify-center">
          {({ isActive }) => {
            <div className="relative w-[245px] h-[245px]">
              <Image
                src={Clairo}
                alt={item.albumName}
                fill
                className="object-cover border-2 border-black"
              />
            </div>;
          }}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
