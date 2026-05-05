import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/app/lib/queryKeys";
import { CACHE_TIMES } from "@/app/lib/constants";
import {
  getSearch,
  getNewReleases,
  getPopularAlbums,
} from "@/app/actions/music_and_reviews_service";
import { useDebounce } from "./useDebounce";

export function useAutocomplete(query: string) {
  const debouncedQuery = useDebounce(query, 300);
  const hasQuery = debouncedQuery.length >= 2;

  const { data: suggestionData, isFetching } = useQuery({
    queryKey: queryKeys.searchAlbums(debouncedQuery),
    queryFn: () => getSearch(debouncedQuery),
    enabled: hasQuery,
    staleTime: CACHE_TIMES.SEARCH_RESULTS,
    placeholderData: keepPreviousData,
  });

  const { data: newReleasesData } = useQuery({
    queryKey: queryKeys.newReleases(2),
    queryFn: () => getNewReleases(2),
    staleTime: CACHE_TIMES.DISCOVERY,
  });

  const { data: popularAlbumsData } = useQuery({
    queryKey: queryKeys.popularAlbums(4),
    queryFn: () => getPopularAlbums(4),
    staleTime: CACHE_TIMES.DISCOVERY,
  });

  return {
    suggestions: suggestionData?.results ?? [],
    newReleases: newReleasesData?.results ?? [],
    popularAlbums: popularAlbumsData?.results ?? [],
    isFetching,
    hasQuery,
    debouncedQuery,
  };
}
