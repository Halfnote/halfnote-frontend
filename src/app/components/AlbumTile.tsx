"use client";
import Image from "next/image";
import { Album } from "../types/types";
import { useTranslation } from "react-i18next";

interface AlbumTileProps {
  albums: Album[];
}
export const AlbumTile = ({ albums }: AlbumTileProps) => {
  const { t } = useTranslation("profile");

  return (
    <div className="flex flex-col items-center">
      <div
        style={{ width: `210px`, height: `210px` }}
        className="grid grid-cols-2 gap-2 p-2 rounded-[10px] border border-black shadow-md"
      >
        {albums?.slice(0, 4).map((fav) => (
          <div
            key={fav.id}
            className="flex items-center justify-center w-[90px] h-[90px] rounded-[10px] shadow-md overflow-hidden border border-black"
          >
            <Image
              src={fav.cover_url || "/default-album.png"}
              alt={`${fav.title} cover`}
              className="object-cover w-full h-full"
              width={75}
              height={75}
            />
          </div>
        ))}
      </div>
      <h2 className="mt-3 text-[16px] font-semibold leading-tight text-black text-center line-clamp-1">
        {t("albums.more_favorites")}
      </h2>
    </div>
  );
};
