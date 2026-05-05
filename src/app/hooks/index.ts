import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/actions/dal";
import {
  getSearch,
  getOthersActivity,
  getUserActivity,
  getUserReviews,
  getAlbumDetails,
  getNewReleases,
  getPopularAlbums,
  getSearchUsers,
  getArtistDetails,
  getSearchArtists,
} from "@/app/actions/music_and_reviews_service";
import {
  createReview,
  editReview,
  toggleLike,
} from "@/app/actions/reviews_service";
import { EditProfile } from "@/app/actions/account_management_service";
import { useQueryClient } from "@tanstack/react-query";
import {
  User,
  Activity,
  Review,
  AlbumDetailData,
  SearchResult,
  ArtistDetails,
} from "../types/types";
import { queryKeys } from "@/app/lib/queryKeys";
import { CACHE_TIMES } from "@/app/lib/constants";
import { ActivityFilterType } from "@/app/lib/types/api";

export const useUser = () =>
  useQuery<User, Error>({
    queryKey: queryKeys.user(),
    queryFn: () => getUser(),
  });

export const useUserReviews = (username: string) =>
  useQuery<Review[]>({
    queryKey: queryKeys.reviewsByUser(username),
    queryFn: () => getUserReviews(username),
    enabled: !!username,
  });

export const useToggleReview = (username: string, discogsId?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["toggleLike"],
    mutationFn: (reviewId: number) => toggleLike(reviewId),

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

    onSuccess: (serverData) => {
      if (discogsId) {
        // Merge server truth into cache
        queryClient.setQueryData<AlbumDetailData>(
          queryKeys.albumDetails(discogsId),
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

export const useUserActivity = (username: string) =>
  useQuery<Activity[], Error>({
    queryKey: queryKeys.activityByUser(username),
    queryFn: () => getUserActivity(username),
    enabled: !!username,
    staleTime: CACHE_TIMES.ACTIVITY,
  });

export const useOthersActivity = (username: string, type: ActivityFilterType) =>
  useQuery<Activity[], Error>({
    queryKey: queryKeys.othersActivity(username, type),
    queryFn: () => getOthersActivity(username, type),
    enabled: !!username && !!type,
  });

export const useSearchAlbums = (discogsID: string) => {
  return useQuery({
    queryKey: queryKeys.searchAlbums(discogsID),
    queryFn: () => getSearch(discogsID),
    enabled: !!discogsID && discogsID.length > 0,
    staleTime: CACHE_TIMES.SEARCH_RESULTS,
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: queryKeys.searchUsers(query),
    queryFn: () => getSearchUsers(query),
    enabled: !!query && query.length > 0,
    staleTime: CACHE_TIMES.USER_SEARCH,
  });
};

export const useSearchArtists = (query: string) => {
  return useQuery({
    queryKey: queryKeys.searchArtists(query),
    queryFn: () => getSearchArtists(query),
    enabled: !!query && query.length > 0,
    staleTime: CACHE_TIMES.USER_SEARCH,
  });
};

export const useAlbumDetails = (discogsID: string) => {
  return useQuery<AlbumDetailData, Error>({
    queryKey: queryKeys.albumDetails(discogsID),
    queryFn: () => getAlbumDetails(discogsID),
    enabled: !!discogsID,
    staleTime: CACHE_TIMES.ALBUM_DETAILS,
  });
};
export const useCreateReview = (username: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["createReview"],
    mutationFn: async ({
      discogsId,
      ratingNumber,
      description,
      genres,
    }: {
      discogsId: string;
      ratingNumber: number;
      description: string;
      genres: string[];
    }) => await createReview(discogsId, ratingNumber, description, genres),

    onMutate: async (review) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: queryKeys.reviewsByUser(username),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.activityByUser(username),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.albumDetails(review.discogsId),
        }),
      ]);

      const snapshots = {
        reviews: queryClient.getQueryData(queryKeys.reviewsByUser(username)),
        activity: queryClient.getQueryData(queryKeys.activityByUser(username)),
        album: queryClient.getQueryData<AlbumDetailData>(
          queryKeys.albumDetails(review.discogsId),
        ),
      };

      // Get user data for avatar
      const userData = queryClient.getQueryData<User>(queryKeys.user());

      // Create optimistic review with temporary ID
      const tempReview: Review = {
        id: -Date.now(),
        rating: review.ratingNumber,
        content: review.description,
        album_discogs_id: review.discogsId,
        is_liked_by_user: false,
        likes_count: 0,
        comments_count: 0,
        username: username.toLowerCase(),
        user_avatar: userData?.avatar || null,
        user_is_staff: userData?.is_staff || false,
        created_at: new Date().toISOString(),
        album_title: snapshots.album?.album.title || "",
        album_artist: snapshots.album?.album.artist || "",
        album_cover: snapshots.album?.album.cover_url || null,
        album_artist_photo: snapshots.album?.album.artist_photo_url || null,
        album_year: snapshots.album?.album.year,
        is_pinned: false,
        user_genres: review.genres.map((name) => ({ id: 0, name })), // Temporary ID, will be replaced by server
      };

      // Optimistically add to albumDetails
      queryClient.setQueryData<AlbumDetailData>(
        queryKeys.albumDetails(review.discogsId),
        (old) => {
          if (!old) return old;
          const newReviewCount = old.review_count + 1;
          const newAverageRating =
            old.review_count > 0
              ? parseFloat(
                  (
                    ((old.average_rating ?? 0) * old.review_count +
                      review.ratingNumber) /
                    newReviewCount
                  ).toFixed(2),
                )
              : review.ratingNumber;

          return {
            ...old,
            reviews: [tempReview, ...old.reviews],
            review_count: newReviewCount,
            average_rating: newAverageRating,
          };
        },
      );

      // Optimistically add to reviews list
      queryClient.setQueryData<Review[]>(
        queryKeys.reviewsByUser(username),
        (old) => [tempReview, ...(old || [])],
      );

      return snapshots;
    },

    onSuccess: (serverData, variables) => {
      // Update with real server data
      queryClient.setQueryData<AlbumDetailData>(
        queryKeys.albumDetails(variables.discogsId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            reviews: old.reviews.map((r) =>
              r.id < 0 && r.rating === serverData.rating ? serverData : r,
            ),
          };
        },
      );

      queryClient.setQueryData<Review[]>(
        queryKeys.reviewsByUser(username),
        (old) =>
          old
            ? old.map((r) =>
                r.id < 0 && r.rating === serverData.rating ? serverData : r,
              )
            : old,
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviewsByUser(username),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityByUser(username),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.albumDetails(variables.discogsId),
      });
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates
      if (context?.album) {
        queryClient.setQueryData(
          queryKeys.albumDetails(variables.discogsId),
          context.album,
        );
      }
      if (context?.reviews) {
        queryClient.setQueryData(
          queryKeys.reviewsByUser(username),
          context.reviews,
        );
      }
      if (context?.activity) {
        queryClient.setQueryData(
          queryKeys.activityByUser(username),
          context.activity,
        );
      }
    },
  });
  return {
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    createReviewMutation: mutation,
    isPending: mutation.isPending,
  };
};

export const useEditReview = (username: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["editReview"],
    mutationFn: async ({
      reviewId,
      ratingNumber,
      description,
      genres,
    }: {
      reviewId: number;
      discogsId: string;
      ratingNumber: number;
      description: string;
      genres: string[];
    }) => await editReview(reviewId, ratingNumber, description, genres),

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

      // Optimistic: albumDetails
      queryClient.setQueryData<AlbumDetailData>(
        queryKeys.albumDetails(vars.discogsId),
        (old) => {
          if (!old) return old;
          const updatedReviews = old.reviews.map((r) =>
            r.id === vars.reviewId
              ? {
                  ...r,
                  rating: vars.ratingNumber,
                  content: vars.description,
                  user_genres: vars.genres.map((name) => ({
                    id: 0,
                    name,
                  })),
                  is_liked_by_user: r.is_liked_by_user,
                }
              : r,
          );
          const n = old.review_count;
          const oldReview = old.reviews.find((r) => r.id === vars.reviewId);
          const oldRating = oldReview?.rating ?? 0;
          const updatedAverageRating =
            n > 0
              ? parseFloat(
                  (
                    (old.average_rating ?? 0) +
                    (vars.ratingNumber - oldRating) / n
                  ).toFixed(2),
                )
              : vars.ratingNumber;
          return {
            ...old,
            reviews: updatedReviews,
            average_rating: updatedAverageRating,
          };
        },
      );

      // Optimistic: reviews
      queryClient.setQueryData<Review[]>(
        queryKeys.reviewsByUser(username),
        (old) =>
          old
            ? old.map((r) =>
                r.id === vars.reviewId
                  ? {
                      ...r,
                      rating: vars.ratingNumber,
                      content: vars.description,
                      user_genres: vars.genres.map((name) => ({
                        id: 0,
                        name,
                      })),
                      is_liked_by_user: r.is_liked_by_user,
                    }
                  : r,
              )
            : old,
      );

      // Optimistic: activity
      queryClient.setQueryData<Activity[]>(
        queryKeys.activityByUser(username),
        (old) =>
          old
            ? old.map((a) =>
                a.review_details && a.review_details.id === vars.reviewId
                  ? {
                      ...a,
                      review_details: {
                        ...a.review_details,
                        rating: vars.ratingNumber,
                        content: vars.description,
                        user_genres: vars.genres.map((name) => ({
                          id: 0,
                          name,
                        })),
                        is_liked_by_user: a.review_details.is_liked_by_user,
                      },
                    }
                  : a,
              )
            : old,
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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["editProfile"],
    mutationFn: async ({
      name,
      bio,
      location,
      avatar,
      banner,
    }: {
      name: string;
      bio?: string;
      location?: string;
      avatar?: File;
      banner?: File;
    }) => await EditProfile(name, bio, location, avatar, banner),

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
  return useQuery<{ results: SearchResult[]; cached: boolean }, Error>({
    queryKey: queryKeys.newReleases(limit),
    queryFn: () => getNewReleases(limit),
    staleTime: CACHE_TIMES.DISCOVERY,
  });
};

export const usePopularAlbums = (limit: number = 4) => {
  return useQuery<{ results: SearchResult[]; cached: boolean }, Error>({
    queryKey: queryKeys.popularAlbums(limit),
    queryFn: () => getPopularAlbums(limit),
    staleTime: CACHE_TIMES.DISCOVERY,
  });
};

export const useArtistDetails = (artistName: string) =>
  useQuery<ArtistDetails, Error>({
    queryKey: queryKeys.artistDetails(artistName),
    queryFn: () => getArtistDetails(artistName),
    enabled: !!artistName,
    staleTime: CACHE_TIMES.ALBUM_DETAILS, // 30 min cache to match backend
  });
