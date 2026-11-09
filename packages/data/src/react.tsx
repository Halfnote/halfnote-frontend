"use client";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type DefaultOptions,
} from "@tanstack/react-query";
import { createContext, useCallback, useContext, type ReactNode } from "react";
import { ApiError, type HalfnoteClient } from "./client";
import type { CreateListInput, EditProfileInput, EditReviewInput, ReviewInput } from "./endpoints";
import type {
  Activity,
  ActivityFilterType,
  AlbumDetailData,
  Genre,
  Review,
  User,
} from "./types";
import { queryKeys } from "./queryKeys";
import { CACHE_TIMES } from "./constants";
import { useDebounce } from "./useDebounce";

export { useDebounce };

const ClientContext = createContext<HalfnoteClient | null>(null);

/** Mount inside QueryClientProvider. `client` must be stable (module scope or useState). */
export function HalfnoteProvider({
  client,
  children,
}: {
  client: HalfnoteClient;
  children: ReactNode;
}) {
  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>;
}

function useClient(): HalfnoteClient {
  const client = useContext(ClientContext);
  if (!client) throw new Error("Halfnote hooks must be used inside <HalfnoteProvider>");
  return client;
}

export const queryClientDefaults: DefaultOptions = {
  queries: {
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    // A 4xx will fail the same way again; retry other failures once.
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status >= 400 && error.status < 500) &&
      failureCount < 1,
  },
  mutations: {
    // Mutations are not idempotent: a retried like toggles twice.
    retry: 0,
  },
};

/** Wipes every cached query. Call on logout: query keys are not user-scoped. */
export function useClearSession(): () => void {
  const queryClient = useQueryClient();
  return useCallback(() => queryClient.clear(), [queryClient]);
}

export const useUser = () => {
  const client = useClient();
  return useQuery<User, Error>({
    queryKey: queryKeys.user(),
    queryFn: () => client.profile(),
  });
};

export const useUserReviews = (username: string) => {
  const client = useClient();
  return useQuery<Review[]>({
    queryKey: queryKeys.reviewsByUser(username),
    queryFn: () => client.userReviews(username),
    enabled: !!username,
  });
};

export const useToggleReview = (username: string, discogsId?: string) => {
  const client = useClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["toggleLike"],
    mutationFn: (reviewId: number) => client.toggleLike(reviewId),

    onMutate: async (reviewId) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: queryKeys.reviewsByUser(username),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.activityByUser(username),
        }),
        discogsId &&
          queryClient.cancelQueries({
            queryKey: queryKeys.albumDetails(discogsId),
          }),
      ]);

      const snapshots = {
        reviews: queryClient.getQueryData(queryKeys.reviewsByUser(username)),
        activity: queryClient.getQueryData(queryKeys.activityByUser(username)),
        album: discogsId
          ? queryClient.getQueryData(queryKeys.albumDetails(discogsId))
          : undefined,
      };

      // Optimistic update: reviews
      queryClient.setQueryData<Review[]>(
        queryKeys.reviewsByUser(username),
        (old = []) =>
          old.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  is_liked_by_user: !r.is_liked_by_user,
                  likes_count: r.likes_count + (r.is_liked_by_user ? -1 : 1),
                }
              : r,
          ),
      );

      // Optimistic update: activity
      queryClient.setQueryData<Activity[]>(
        queryKeys.activityByUser(username),
        (old = []) =>
          old.map((a) =>
            a.review_details && a.review_details.id === reviewId
              ? {
                  ...a,
                  review_details: {
                    ...a.review_details,
                    is_liked_by_user: !a.review_details.is_liked_by_user,
                    likes_count:
                      (a.review_details.likes_count ?? 0) +
                      (a.review_details.is_liked_by_user ? -1 : 1),
                  },
                }
              : a,
          ),
      );

      // Optimistic update: albumDetails
      if (discogsId) {
        queryClient.setQueryData<AlbumDetailData>(
          queryKeys.albumDetails(discogsId),
          (old) =>
            old
              ? {
                  ...old,
                  reviews: old.reviews.map((r) =>
                    r.id === reviewId
                      ? {
                          ...r,
                          is_liked_by_user: !r.is_liked_by_user,
                          likes_count:
                            r.likes_count + (r.is_liked_by_user ? -1 : 1),
                        }
                      : r,
                  ),
                }
              : old,
        );
      }

      return snapshots;
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.reviews) {
        queryClient.setQueryData(
          queryKeys.reviewsByUser(username),
          ctx.reviews,
        );
      }
      if (ctx?.activity) {
        queryClient.setQueryData(
          queryKeys.activityByUser(username),
          ctx.activity,
        );
      }
      if (discogsId && ctx?.album) {
        queryClient.setQueryData(queryKeys.albumDetails(discogsId), ctx.album);
      }
    },

    onSuccess: ({ action, like_count }, reviewId) => {
      // The server returns {action, like_count}; write that truth over the optimistic guess.
      const truth = { is_liked_by_user: action === "liked", likes_count: like_count };
      queryClient.setQueryData<Review[]>(queryKeys.reviewsByUser(username), (old) =>
        old?.map((r) => (r.id === reviewId ? { ...r, ...truth } : r)),
      );
      queryClient.setQueryData<Activity[]>(queryKeys.activityByUser(username), (old) =>
        old?.map((a) =>
          a.review_details?.id === reviewId
            ? { ...a, review_details: { ...a.review_details, ...truth } }
            : a,
        ),
      );
      if (discogsId) {
        queryClient.setQueryData<AlbumDetailData>(
          queryKeys.albumDetails(discogsId),
          (old) =>
            old
              ? {
                  ...old,
                  reviews: old.reviews.map((r) =>
                    r.id === reviewId ? { ...r, ...truth } : r,
                  ),
                }
              : old,
        );
      }

      // Invalidate queries to ensure fresh data on next mount/focus
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviewsByUser(username),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityByUser(username),
      });
      if (discogsId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.albumDetails(discogsId),
        });
      }
    },
  });

  return {
    toggleLikeMutation: mutation,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
};

export const useUserActivity = (username: string) => {
  const client = useClient();
  return useQuery<Activity[], Error>({
    queryKey: queryKeys.activityByUser(username),
    queryFn: () => client.userActivity(username),
    enabled: !!username,
    staleTime: CACHE_TIMES.ACTIVITY,
  });
};

/** `username` only scopes the cache key; the endpoint ignores it (kept as-is, see MONOREPO_PLAN Decisions). */
export const useOthersActivity = (username: string, type: ActivityFilterType) => {
  const client = useClient();
  return useQuery<Activity[], Error>({
    queryKey: queryKeys.othersActivity(username, type),
    queryFn: () => client.othersActivity(type),
    enabled: !!username && !!type,
  });
};

export const useSearchAlbums = (discogsID: string) => {
  const client = useClient();
  return useQuery({
    queryKey: queryKeys.searchAlbums(discogsID),
    queryFn: () => client.searchAlbums(discogsID),
    enabled: !!discogsID && discogsID.length > 0,
    staleTime: CACHE_TIMES.SEARCH_RESULTS,
    placeholderData: keepPreviousData,
  });
};

export const useSearchUsers = (query: string) => {
  const client = useClient();
  return useQuery({
    queryKey: queryKeys.searchUsers(query),
    queryFn: () => client.searchUsers(query),
    enabled: !!query && query.length > 0,
    staleTime: CACHE_TIMES.USER_SEARCH,
    placeholderData: keepPreviousData,
  });
};

export const useSearchArtists = (query: string) => {
  const client = useClient();
  return useQuery({
    queryKey: queryKeys.searchArtists(query),
    queryFn: () => client.searchArtists(query),
    enabled: !!query && query.length > 0,
    staleTime: CACHE_TIMES.USER_SEARCH,
  });
};

export const useAlbumDetails = (discogsID: string) => {
  const client = useClient();
  return useQuery<AlbumDetailData, Error>({
    queryKey: queryKeys.albumDetails(discogsID),
    queryFn: () => client.albumDetails(discogsID),
    enabled: !!discogsID,
    staleTime: CACHE_TIMES.ALBUM_DETAILS,
  });
};
export const useRecentlyViewed = () => {
  const client = useClient();
  return useQuery({
    queryKey: queryKeys.recentlyViewed(),
    queryFn: () => client.recentlyViewed(),
  });
};

export const useRecordView = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["recordView"],
    mutationFn: (discogsId: string) => client.recordView(discogsId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.recentlyViewed() }),
  });
};

export const useCreateReview = (username: string) => {
  const client = useClient();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["createReview"],
    mutationFn: (input: ReviewInput) => client.createReview(input),
    onSettled: (_data, _err, { discogsId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.albumDetails(discogsId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.reviewsByUser(username) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.activityByUser(username) }),
      ]),
  });
  return {
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    createReviewMutation: mutation,
    isPending: mutation.isPending,
  };
};

/** The review text as the server returns it in `content`. */
const contentOf = (headline: string, body: string) => (body ? `${headline}\n\n${body}` : headline);

export const useEditReview = (username: string) => {
  const client = useClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["editReview"],
    mutationFn: ({ discogsId: _discogsId, ...input }: EditReviewInput & { discogsId: string }) =>
      client.editReview(input),

    onMutate: async (vars) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: queryKeys.reviewsByUser(username),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.activityByUser(username),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.albumDetails(vars.discogsId),
        }),
      ]);

      const snapshots = {
        reviews: queryClient.getQueryData(queryKeys.reviewsByUser(username)),
        activity: queryClient.getQueryData(queryKeys.activityByUser(username)),
        album: queryClient.getQueryData(queryKeys.albumDetails(vars.discogsId)),
      };

      const text = {
        rating: vars.rating,
        headline: vars.headline,
        body: vars.body,
        content: contentOf(vars.headline, vars.body),
      };
      const genres = (old: Genre[]) => vars.genres?.map((name) => ({ id: 0, name })) ?? old;

      // ponytail: the average is left to the refetch; it now counts each user's latest rated review.
      queryClient.setQueryData<AlbumDetailData>(
        queryKeys.albumDetails(vars.discogsId),
        (old) =>
          old && {
            ...old,
            reviews: old.reviews.map((r) =>
              r.id === vars.reviewId ? { ...r, ...text, user_genres: genres(r.user_genres) } : r,
            ),
          },
      );

      queryClient.setQueryData<Review[]>(queryKeys.reviewsByUser(username), (old) =>
        old?.map((r) => (r.id === vars.reviewId ? { ...r, ...text, user_genres: genres(r.user_genres) } : r)),
      );

      // ponytail: activity rating stays as it was; ReviewActivityDetails.rating is typed non-null.
      queryClient.setQueryData<Activity[]>(queryKeys.activityByUser(username), (old) =>
        old?.map((a) =>
          a.review_details?.id === vars.reviewId
            ? {
                ...a,
                review_details: {
                  ...a.review_details,
                  headline: text.headline,
                  body: text.body,
                  content: text.content,
                  user_genres: genres(a.review_details.user_genres),
                },
              }
            : a,
        ),
      );

      return snapshots;
    },

    onError: (_err, vars, ctx) => {
      if (ctx?.reviews) {
        queryClient.setQueryData(
          queryKeys.reviewsByUser(username),
          ctx.reviews,
        );
      }
      if (ctx?.activity) {
        queryClient.setQueryData(
          queryKeys.activityByUser(username),
          ctx.activity,
        );
      }
      if (ctx?.album) {
        queryClient.setQueryData(
          queryKeys.albumDetails(vars.discogsId),
          ctx.album,
        );
      }
    },

    onSuccess: (serverData) => {
      // Merge server truth into cache
      queryClient.setQueryData<AlbumDetailData>(
        queryKeys.albumDetails(serverData.album_discogs_id),
        (old) =>
          old
            ? {
                ...old,
                reviews: old.reviews.map((r) =>
                  r.id === serverData.id ? serverData : r,
                ),
              }
            : old,
      );

      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviewsByUser(username),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityByUser(username),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.albumDetails(serverData.album_discogs_id),
      });
    },
  });

  return {
    editReviewMutation: mutation,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
};

export const useEditProfile = () => {
  const client = useClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["editProfile"],
    mutationFn: (vars: EditProfileInput & { name: string }) =>
      client.editProfile(vars),

    onMutate: async (vars) => {
      // Cancel outgoing user queries
      await queryClient.cancelQueries({ queryKey: queryKeys.user() });

      // Snapshot current user data
      const previousUser = queryClient.getQueryData<User>(queryKeys.user());

      // Optimistically update user data
      queryClient.setQueryData<User>(queryKeys.user(), (old) => {
        if (!old) return old;

        return {
          ...old,
          username: vars.name,
          bio: vars.bio ?? old.bio,
          location: vars.location ?? old.location,
          // For avatar/banner, we'll keep old values until server confirms
          // since we need the uploaded URLs from server
        };
      });

      return { previousUser };
    },

    onError: (_err, _vars, context) => {
      // Rollback to previous user data on error
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.user(), context.previousUser);
      }
    },

    onSuccess: (serverData) => {
      // Update with server response (includes uploaded image URLs)
      queryClient.setQueryData(queryKeys.user(), serverData);

      // Invalidate related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.user() });
    },
  });

  return {
    editProfileMutation: mutation,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
};

export const useNewReleases = (limit: number = 2) => {
  const client = useClient();
  return useQuery({
    queryKey: queryKeys.newReleases(limit),
    queryFn: () => client.newReleases(limit),
    staleTime: CACHE_TIMES.DISCOVERY,
  });
};

export const usePopularAlbums = (limit: number = 4) => {
  const client = useClient();
  return useQuery({
    queryKey: queryKeys.popularAlbums(limit),
    queryFn: () => client.popularAlbums(limit),
    staleTime: CACHE_TIMES.DISCOVERY,
  });
};

export const useArtistDetails = (artistName: string) => {
  const client = useClient();
  return useQuery({
    queryKey: queryKeys.artistDetails(artistName),
    queryFn: () => client.artistDetails(artistName),
    enabled: !!artistName,
    staleTime: CACHE_TIMES.ALBUM_DETAILS,
  });
};

/** Replaces CreateAlbumListModal's direct server-action call. */
export const useCreateList = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createList"],
    mutationFn: (input: CreateListInput) => client.createList(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.lists() }),
  });
};

export function useAutocomplete(query: string) {
  const client = useClient();
  const debouncedQuery = useDebounce(query, 300);
  const hasQuery = debouncedQuery.length >= 2;

  const { data: suggestionData, isFetching } = useQuery({
    queryKey: queryKeys.searchAlbums(debouncedQuery),
    queryFn: () => client.searchAlbums(debouncedQuery),
    enabled: hasQuery,
    staleTime: CACHE_TIMES.SEARCH_RESULTS,
    placeholderData: keepPreviousData,
  });

  const { data: newReleasesData } = useQuery({
    queryKey: queryKeys.newReleases(2),
    queryFn: () => client.newReleases(2),
    staleTime: CACHE_TIMES.DISCOVERY,
  });

  const { data: popularAlbumsData } = useQuery({
    queryKey: queryKeys.popularAlbums(4),
    queryFn: () => client.popularAlbums(4),
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
