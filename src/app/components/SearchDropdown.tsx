"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Icons } from "../icons/icons";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { SearchResult } from "../types/types";
import SplitCard from "./splitCard";
import { useRouter } from "next/navigation";

export const SearchDropdown = ({
  query,
  onClose,
  setSearchQuery,
}: {
  query: string;
  onClose: () => void;
  setSearchQuery: (query: string) => void;
}) => {
  const { recentSearches, removeSearch, addSearch } = useRecentSearches();
  const { suggestions, newReleases, popularAlbums, isFetching, hasQuery, debouncedQuery } =
    useAutocomplete(query);
  const router = useRouter();

  const handleSearch = (searchTerm: string) => {
    addSearch(searchTerm);
    onClose();
    setSearchQuery("");
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const renderSuggestionItem = (text: string, uniqueKey: string, isRaw = false) => {
    const prefix = !isRaw && text.toLowerCase().startsWith(debouncedQuery.toLowerCase())
      ? text.slice(0, debouncedQuery.length)
      : text;
    const suffix = !isRaw && text.toLowerCase().startsWith(debouncedQuery.toLowerCase())
      ? text.slice(debouncedQuery.length)
      : "";

    return (
      <div
        key={uniqueKey}
        onClick={() => handleSearch(text)}
        className="flex items-center gap-3 p-2 hover:bg-gray-200 cursor-pointer rounded-lg group"
      >
        <Image
          src={Icons.search}
          alt="Search"
          width={20}
          height={20}
          className="opacity-60 group-hover:opacity-100"
        />
        <p className="another-heading4 text-black text-xl">
          {isRaw ? (
            text
          ) : (
            <>
              {prefix}
              <span className="font-bold">{suffix}</span>
            </>
          )}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      onMouseDown={(e) => e.preventDefault()}
      className="absolute top-full left-0 w-full h-auto max-h-[70vh] overflow-y-auto p-4 bg-[var(--color-bg-gray)] border-x border-b border-black rounded-b-[2rem] rounded-t-none custom-scrollbar shadow-lg z-50"
      initial={{ opacity: 0, scaleY: 0.8, transformOrigin: "top" }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0.8, transition: { duration: 0.1 } }}
      transition={{ delay: 0.2, duration: 0.2, ease: "easeOut" }}
    >
      {hasQuery ? (
        <div className="flex flex-col gap-1 relative">
          {/* Thin animated bar while refetching over stale data */}
          {isFetching && suggestions.length > 0 && (
            <motion.div
              className="absolute -top-4 left-0 h-[2px] bg-black rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
          )}

          {/* Skeleton splash — first fetch, no previous data */}
          {isFetching && suggestions.length === 0 ? (
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {/* Raw query item always shows immediately */}
              {renderSuggestionItem(query, "raw-query", true)}
              {/* Skeleton rows */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg animate-pulse"
                >
                  <div className="w-5 h-5 rounded bg-gray-200 shrink-0" />
                  <div
                    className="h-5 bg-gray-200 rounded"
                    style={{ width: `${65 - i * 8}%` }}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <>
              {renderSuggestionItem(query, "raw-query", true)}
              {suggestions
                .filter((item: SearchResult) => item.title.toLowerCase() !== query.toLowerCase())
                .map((item: SearchResult) => renderSuggestionItem(item.title, item.id.toString()))}
            </>
          )}
        </div>
      ) : (
        <>
          <h1 className="another-heading2 text-3xl font-medium mb-2">
            Recent Searches
          </h1>
          <div className="flex flex-row gap-2 mb-4 flex-wrap">
            {recentSearches?.map((search, index) => (
              <div
                key={index}
                className="flex flex-row gap-2 w-auto h-7 border-black border-1 rounded-full items-center justify-center p-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSearch(search)}
              >
                <Image
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearch(search);
                  }}
                  src={Icons.close}
                  alt="Close"
                  width={10}
                  height={10}
                  className="hover:cursor-pointer"
                />
                {search}
              </div>
            ))}
          </div>

          <h1 className="another-heading2 text-3xl font-medium mb-2">
            New Releases
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {newReleases?.map((album: SearchResult, index: number) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/albums?query=${album.id}`);
                  onClose();
                }}
              >
                <SplitCard
                  image={album.cover_image || ""}
                  albumName={album.title}
                  artistName={album.artist}
                  size="large"
                />
              </div>
            ))}
          </div>

          <h1 className="another-heading2 text-3xl font-medium mb-2">
            Popular Albums
          </h1>
          <div className="grid grid-cols-2 gap-4">
            {popularAlbums?.map((album: SearchResult, index: number) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/albums?query=${album.id}`);
                  onClose();
                }}
              >
                <SplitCard
                  image={album.cover_image || ""}
                  albumName={album.title}
                  artistName={album.artist}
                  size="small"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};
