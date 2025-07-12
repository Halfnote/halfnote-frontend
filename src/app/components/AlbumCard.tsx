"use client";
import Image, { StaticImageData } from "next/image";

interface AlbumCardProps {
  albumCover: StaticImageData | string;
  albumName: string;
  artistName: string;
  size?: number;
}
export const AlbumCard = ({
  albumCover,
  albumName,
  artistName,
  size=175,
}: AlbumCardProps) => {
  return (
    <div className={`flex flex-col items-center w-[${size}px]`}>
      <div className={`w-[${size}px] h-[${size}px] rounded-[10px] shadow-md overflow-hidden border border-gray-300`}>
        <Image
          src={albumCover}
          alt={`${albumName} cover`}
          className="object-cover w-full h-full"
          width={size}
          height={size}
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
