"use client";
import Image, { StaticImageData } from "next/image";

interface AlbumCardProps {
  albumCover: StaticImageData;
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
      <div className="rounded-[10px] shadow-md overflow-hidden border border-gray-300">
        <Image
          src={albumCover}
          alt={`${albumName} cover`}
          className="object-cover"
        />
      </div>
      <h2 className="mt-3 text-[18px] font-semibold leading-tight text-black text-center">
        {albumName}
      </h2>
      <p className="text-base text-gray-600 text-center">{artistName}</p>
    </div>
  );
};
