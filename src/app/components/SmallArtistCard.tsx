import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SmallArtistCardProps {
  artist: { artist_name: string; artist_photo: string };
}

export const SmallArtistCard = ({ artist }: SmallArtistCardProps) => {
  const router = useRouter();
  return (
    <div
      className="w-full h-[80px] flex flex-row items-center border border-black rounded-2xl bg-white overflow-hidden shadow-sm hover: cursor-pointer"
      onClick={() => router.push(`/artist?name=${artist.artist_name}`)}
    >
      <div className="w-[80px] h-[80px] shrink-0 border-r border-black relative">
        <Image
          src={artist.artist_photo || "/default-user.png"}
          alt={artist.artist_name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 px-3">
        <span
          style={{ fontWeight: "bolder" }}
          className="text-xl another-heading4 leading-tight truncate text-[#767676]"
        >
          {artist.artist_name}
        </span>
      </div>
    </div>
  );
};
