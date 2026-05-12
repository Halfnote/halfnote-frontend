import React from "react";
import Image from "next/image";
import { SearchResult } from "@/app/types/types";
import { useRouter } from "next/navigation";

interface SmallAlbumCardProps {
  album: SearchResult;
}
export const SmallAlbumCard = ({ album }: SmallAlbumCardProps) => {
  const router = useRouter();
  return (
    <div
      className="w-[330px] h-[450px] flex flex-col border-1 border-black shrink-0 overflow-hidden rounded-2xl hover:cursor-pointer"
      onClick={() => router.push(`/albums?query=${album.id}`)}
    >
      <div className="w-full h-[340px] relative">
        <Image
          src={album.cover_image || ""}
          alt={album.title || ""}
          fill
          className="object-cover"
        />
      </div>
      <span className="flex flex-col p-2 gap-y-7">
        <span className="text-3xl font-bold truncate another-heading1">
          {album.title}
        </span>
        <div className="flex justify-between">
          <span
            className="text-gray-500 truncate another-heading4"
            style={{ fontWeight: "bolder" }}
          >
            {album.artist}
          </span>
          <span className="text-sm text-gray-500 another-heading4">
            {album.year}
          </span>
        </div>
      </span>
    </div>
  );
};
