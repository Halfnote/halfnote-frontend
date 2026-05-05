"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "../../icons/icons";
import { useSearchParams } from "next/navigation";
import { useArtistDetails } from "@/app/hooks";
import { AlbumCard } from "../AlbumCard";
import { ArtistAlbum } from "@/app/types/types";

const ArtistDetailsClient = () => {
  const searchParams = useSearchParams();
  const artistName = searchParams.get("name");
  const {
    data: artistDetails,
    isLoading,
    isError,
  } = useArtistDetails(artistName ?? "");
  console.log(artistDetails);

  if (isLoading)
    return <p className="text-center mt-10">Loading artist details...</p>;
  if (isError || !artistDetails)
    return (
      <p className="text-center mt-10 text-red-500">
        Error loading artist details.
      </p>
    );

  if (artistDetails) {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto px-4 gap-8 pb-20">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <h1 className="another-heading1 text-[120px] leading-tight mb-8">
              {artistName}
            </h1>

            {/* About Box */}
            <div className="border border-black rounded-2xl p-6 bg-[#f9f9f9] max-w-md shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-black p-1 rounded-sm size-8 flex items-center justify-center">
                  <Image
                    src={Icons.halfnote}
                    alt="About"
                    width={20}
                    height={20}
                    className="invert"
                  />
                </div>
                <h2 className="another-heading2 text-2xl font-bold italic">
                  About
                </h2>
              </div>
              <p className="another-body text-gray-800 leading-relaxed italic text-base">
                {artistDetails.bio ?? "No bio available"}
              </p>
            </div>
          </div>

          {/* Artist Image */}
          <div className="w-full lg:w-[450px] aspect-square relative border-2 border-black rounded-sm overflow-hidden mt-10">
            <Image
              src={
                artistDetails.image ??
                "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
              alt={artistDetails.name}
              className="object-cover"
              fill
            />
          </div>
        </div>

        {/* Albums Section */}
        <div className="border border-black rounded-3xl p-8 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Image
                src={Icons.vinylStack}
                alt="Albums"
                width={40}
                height={40}
              />
              <h2 className="another-heading1 text-4xl italic uppercase">
                Albums
              </h2>
            </div>
            <button className="another-heading6 border border-black rounded-full px-8 py-2 font-bold hover:bg-black hover:text-white transition-colors">
              View All
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {artistDetails.albums.map((album: ArtistAlbum, idx: number) => (
              <AlbumCard
                key={idx}
                albumCover={album.cover_url ?? ""}
                albumName={album.title}
                artistName={album.artist}
              />
            ))}
          </div>
        </div>

        {/* Top Takes Section */}
        <div className="border border-black rounded-3xl p-8 bg-white shadow-sm">
          <h2 className="another-heading1 text-4xl mb-8 uppercase tracking-widest italic">
            Top Takes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border border-gray-300 rounded-2xl p-6 flex flex-col gap-6 shadow-sm hover:border-black transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-full bg-gray-100 border border-black overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] opacity-20">
                        User
                      </div>
                    </div>
                    <div>
                      <h4 className="another-heading1 text-lg font-bold">
                        Debi Tirar Mas Fotos
                      </h4>
                      <p className="another-heading6 text-sm text-gray-400 italic">
                        Bad Bunny
                      </p>
                    </div>
                  </div>
                  <div className="size-12 rounded-full border-2 border-dashed border-green-400 flex items-center justify-center text-green-500 font-bold text-xl">
                    9
                  </div>
                </div>
                <p className="another-body italic text-base text-gray-700 leading-relaxed">
                  &quot;he is good bunny to me&quot;
                </p>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    <button className="another-heading6 text-[10px] border border-black rounded-full px-4 py-1.5 font-bold uppercase tracking-tighter">
                      &quot;Devil&apos;s Cut&quot;
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="size-5 relative cursor-pointer">
                        <Image
                          src={Icons.unlikedHeart}
                          alt="Like"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="another-heading6 text-xs text-black">
                        0
                      </span>
                    </div>
                    <button className="another-heading1 text-[12px] border border-black rounded-full px-6 py-1.5 font-bold uppercase hover:bg-black hover:text-white transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default ArtistDetailsClient;
