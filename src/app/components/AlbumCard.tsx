"use client";
import Image, { StaticImageData } from "next/image";

interface AlbumCardProps {
  albumCover: StaticImageData | string;
  albumName: string;
  artistName: string;
}
export const AlbumCard = ({
  albumCover,
  albumName,
  artistName,
}: AlbumCardProps) => {
  return (
    <div className="flex flex-col items-center w-[175px]">
      <div className="w-[175px] h-[175px] rounded-[10px] shadow-md overflow-hidden border border-gray-300">
        <Image
          src={albumCover}
          alt={`${albumName} cover`}
          className="object-cover w-full h-full"
          width={175}
          height={175}
        />
      </div>
      <h2 className="mt-3 text-[16px] font-semibold leading-tight text-black text-center line-clamp-1">
        {albumName}
      </h2>
      <p className="text-sm text-gray-600 text-center line-clamp-1">
        {artistName}
      </p>
    </div>
  );
};
