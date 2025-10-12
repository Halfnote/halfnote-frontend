"use client";
import { useSearch } from "@/app/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { RecentActivityCard } from "../RecentActivityCard";

export const SearchResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const { data: albumList, isLoading, isError } = useSearch(query || "");

  useEffect(() => {
    if (!isLoading && query) {
      return;
    }
  }, [query, isLoading]);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">No Search Query Provided</h1>
        <p className="text-gray-600">Please provide a search query.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen w-screen scale-90">
      <h1 className="text-2xl font-bold mb-4">Search Results for: {query}</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching search results.</p>}
      {albumList?.results && albumList.results.length > 0 ? (
        <ul className="gap-y-2 flex flex-col w-full max-w-screen">
          {albumList.results.map((album: { id?: string; discogs_id?: string; cover_image?: string; title?: string; artist?: string; rating?: number; review?: unknown; time?: string }) => (
            <button
              onClick={() => {
                router.push(`/albums?query=${album.id || album.discogs_id}`);
              }}
              className="w-full cursor-pointer"
              key={album.id || album.discogs_id}
            >
              <RecentActivityCard
                albumCover={album.cover_image || ""}
                albumTitle={album.title || "Unknown Album"}
                artistName={album.artist || "Unknown Artist"}
                rating={album.rating || 0}
                hasReview={!!album.review}
                time={album.time || new Date().toISOString()}
              />
            </button>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};
