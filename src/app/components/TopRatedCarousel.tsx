"use client";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { TopRated } from "../types/review";
import Image from "next/image";
import { RockBadge } from "../icons/stamps";
import Clairo from "../../../public/sample_images/813adHqElhL.jpg";

type ListCarouselProps = {
  items: TopRated[];
};

export const TopRatedCarousel = ({ items }: ListCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="flex flex-col items-center w-full h-full overflow-hidden">
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex h-full">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center flex-[0_0_100%] h-full text-center"
            >
              <div className="relative w-40 h-40">
                <Image
                  src={Clairo}
                  alt={item.albumName}
                  fill
                  className="object-cover rounded-md"
                />

                <div className="w-15 h-15 absolute -top-4 left-[75%] flex items-center justify-center">
                  <RockBadge number={8} />
                </div>
              </div>
              <div className="mt-2">
                <h1 className="another-top-rated-album">{item.albumName}</h1>
                <h2 className="another-heading4">{item.artistName}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex gap-2 mt-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full border-2 border-black ${
              index === selectedIndex ? "bg-black" : "bg-[#D9D9D9]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
