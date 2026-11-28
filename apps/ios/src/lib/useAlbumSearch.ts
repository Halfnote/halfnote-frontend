import { useDebounce, useSearchAlbums } from "@halfnote/data/react";

/** `query` is "" until there is enough text to search for. */
export function useAlbumSearch(text: string, waitMs = 500) {
  const debounced = useDebounce(text.trim().toLowerCase(), waitMs);
  const query = debounced.length >= 2 ? debounced : "";
  return { query, search: useSearchAlbums(query) };
}

export const SEARCH_FAILED = "Search isn't working right now. Try again in a moment.";
export const noMatches = (text: string) => `Nothing matches “${text.trim()}”. Try an artist name.`;
