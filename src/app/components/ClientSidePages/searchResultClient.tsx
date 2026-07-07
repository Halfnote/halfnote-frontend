"use client";
import { useSearchAlbums, useSearchArtists, useSearchUsers } from "@/app/hooks";
import { useSearchParams } from "next/navigation";
import React from "react";
import { SmallAlbumCard } from "@/app/components/SmallAlbumCard";
import {
  ArtistSearchResult,
  SearchResult,
  UserResult,
} from "@/app/types/types";
import { SmallUserCard } from "@/app/components/SmallUserCard";
import { SmallArtistCard } from "@/app/components/SmallArtistCard";

export const SearchResultPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const {
    data: albumList,
    isLoading: albumLoading,
    isError: albumError,
  } = useSearchAlbums(query || "");
  const {
    data: userList,
    isLoading: userLoading,
    isError: userError,
  } = useSearchUsers(query || "");

  const {
    data: artistList,
    isLoading: artistLoading,
    isError: artistError,
  } = useSearchArtists(query || "");

  const isLoading = albumLoading || userLoading || artistLoading;
  const isError = albumError || userError || artistError;

  const albums = albumList?.results || [];
  const listeners = userList?.results || [];
  const artists = artistList?.results || [];
  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">No Search Query Provided</h1>
        <p className="text-gray-600">Please provide a search query.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen scale-90">
        <p className="another-heading1 text-5xl">Loading search results...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen scale-90">
        <p className="another-heading2 text-2xl text-red-500">
          Error fetching search results.
        </p>
      </div>
    );
  }

  const hasResults =
    albums.length > 0 || listeners.length > 0 || artists.length > 0;

  return (
    // ponytail: origin-top pins the scale-90 top edge so the gap is static; navbar mb-4 (16px) + mt-1 (4px) = 20px below navbar
    <div className="flex flex-col items-center min-h-screen w-screen scale-90 origin-top pb-20 mt-1">
      {!hasResults ? (
        <div className="flex flex-col items-center h-full mt-20">
          <p className="another-heading2 text-3xl">
            No results found for &quot;{query}&quot;
          </p>
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-screen mt-6">
          <h1 className="text-5xl another-heading1 text-[#767676] mb-6">
            <span className="italic mr-3">Search results for</span>
            <span className="underline">{query}</span>
          </h1>

          {/* Albums Section */}
          <div className="mb-14">
            <h2 className="text-5xl another-heading1 mb-6">Albums</h2>
            {albums.length > 0 ? (
              <div className="flex flex-row gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {albums.map((album: SearchResult) => (
                  <SmallAlbumCard album={album} key={album.id} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic another-heading5">
                No albums found for &quot;{query}&quot;.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-12">
            {/* Artists Column */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-5xl another-heading1">Artists</h2>
              </div>
              {artists.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 h-8/12 overflow-y-scroll">
                  {artists.map((artist: ArtistSearchResult) => (
                    <SmallArtistCard
                      key={artist.id}
                      artist={{
                        artist_name: artist.name,
                        artist_photo: artist.photo_url,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic another-heading5">
                  No artists found for &quot;{query}&quot;.
                </p>
              )}
            </div>

            {/* Listeners Column */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-5xl another-heading1">Listeners</h2>
              </div>
              {listeners.length > 0 ? (
                <div className="flex flex-col gap-3 h-8/12 overflow-y-scroll">
                  {listeners.map((user: UserResult) => (
                    <SmallUserCard user={user} key={user.id} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic another-heading5">
                  No listeners found for &quot;{query}&quot;.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
