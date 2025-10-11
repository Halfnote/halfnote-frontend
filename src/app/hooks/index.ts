import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/actions/dal";
import {
  getSearch,
  getOthersActivity,
  getUserActivity,
  getUserReviews,
  getAlbumDetails,
} from "@/app/actions/music_and_reviews_service";
import {
  createReview,
  editReview,
  toggleLike,
} from "@/app/actions/reviews_service";
import { useQueryClient } from "@tanstack/react-query";
import { User, Activity, Review, AlbumDetailData } from "../types/types";

export const useUser = () =>
  useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

export const useUserReviews = (username: string) =>
  useQuery<Review[]>({
    queryKey: ["reviews", username],
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
        queryClient.cancelQueries({ queryKey: ["reviews", username] }),
        queryClient.cancelQueries({ queryKey: ["activity", username] }),
        discogsId &&
          queryClient.cancelQueries({ queryKey: ["albumDetails", discogsId] }),
      ]);

      const snapshots = {
        reviews: queryClient.getQueryData(["reviews", username]),
        activity: queryClient.getQueryData(["activity", username]),
        album: discogsId
          ? queryClient.getQueryData(["albumDetails", discogsId])
          : undefined,
      };

      // Optimistic update: reviews
      queryClient.setQueryData<Review[]>(["reviews", username], (old = []) =>
        old.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                is_liked_by_user: !r.is_liked_by_user,
                likes_count: r.likes_count + (r.is_liked_by_user ? -1 : 1),
              }
            : r
        )
      );

      // Optimistic update: activity
      queryClient.setQueryData<Activity[]>(["activity", username], (old = []) =>
        old.map((a) =>
          a.review_details && a.review_details.id === reviewId
            ? {
                ...a,
                review_details: {
                  ...a.review_details,
                  is_liked_by_user: !a.review_details.is_liked_by_user,
                  likes_count:
                    a.review_details.likes_count +
                    (a.review_details.is_liked_by_user ? -1 : 1),
                },
              }
            : a
        )
      );

      // Optimistic update: albumDetails
      if (discogsId) {
        queryClient.setQueryData<AlbumDetailData>(
          ["albumDetails", discogsId],
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
                      : r
                  ),
                }
              : old
        );
      }

      return snapshots;
    },

    onError: (_err, _vars, ctx) => {
      ctx?.reviews &&
        queryClient.setQueryData(["reviews", username], ctx.reviews);
      ctx?.activity &&
        queryClient.setQueryData(["activity", username], ctx.activity);
      if (discogsId && ctx?.album) {
        queryClient.setQueryData(["albumDetails", discogsId], ctx.album);
      }
    },

    onSuccess: (serverData) => {
      if (discogsId) {
        // Merge server truth into cache
        queryClient.setQueryData<AlbumDetailData>(
          ["albumDetails", discogsId],
          (old) =>
            old
              ? {
                  ...old,
                  reviews: old.reviews.map((r) =>
                    r.id === serverData.id ? serverData : r
                  ),
                }
              : old
        );
      }

      // Invalidate queries to ensure fresh data on next mount/focus
      queryClient.invalidateQueries({
        queryKey: ["reviews", username],
      });
      queryClient.invalidateQueries({
        queryKey: ["activity", username],
      });
      if (discogsId) {
        queryClient.invalidateQueries({
          queryKey: ["albumDetails", discogsId],
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
    queryKey: ["activity", username],
    queryFn: () => getUserActivity(username),
    enabled: !!username,
    staleTime: 2 * 60 * 1000, // Activity data is fresh for 2 minutes
  });

export const useOthersActivity = (
  username: string,
  type: "friends" | "you" | "incoming"
) =>
  useQuery<Activity[], Error>({
    queryKey: ["other", username, type],
    queryFn: () => getOthersActivity(username, type),
    enabled: !!username && !!type,
  });

export const useSearch = (discogsID: string) => {
  return useQuery({
    queryKey: ["searchAlbum", discogsID],
    queryFn: () => getSearch(discogsID),
    enabled: !!discogsID && discogsID.length > 0,
    staleTime: 10 * 60 * 1000, // Cache search results for 10 minutes
  });
};

export const useAlbumDetails = (discogsID: string) => {
  return useQuery<AlbumDetailData, Error>({
    queryKey: ["albumDetails", discogsID],
    queryFn: () => getAlbumDetails(discogsID),
    enabled: !!discogsID,
    staleTime: 1 * 60 * 1000, // Album details are fresh for 1 minute
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
        queryClient.cancelQueries({ queryKey: ["reviews", username] }),
        queryClient.cancelQueries({ queryKey: ["activity", username] }),
        queryClient.cancelQueries({
          queryKey: ["albumDetails", review.discogsId],
        }),
      ]);

      const snapshots = {
        reviews: queryClient.getQueryData(["reviews", username]),
        activity: queryClient.getQueryData(["activity", username]),
        album: queryClient.getQueryData<AlbumDetailData>([
          "albumDetails",
          review.discogsId,
        ]),
      };

      // Get user data for avatar
      const userData = queryClient.getQueryData<User>(["user"]);

      // Create optimistic review with temporary ID
      const tempReview: Review = {
        id: -Date.now(),
        rating: review.ratingNumber,
        content: review.description,
        text: review.description,
        album_discogs_id: review.discogsId,
        is_liked_by_user: false,
        likes_count: 0,
        comments_count: 0,
        username: username.toLowerCase(),
        user_avatar: userData?.avatar || "/default-avatar.png",
        user_is_staff: userData?.is_staff || false,
        created_at: new Date().toISOString(),
        album_title: snapshots.album?.album.title || "",
        album_artist: snapshots.album?.album.artist || "",
        album_cover:
          snapshots.album?.album.cover_url ||
          snapshots.album?.album.cover_image ||
          "/default-album.png",
        is_pinned: false,
        user_genres: review.genres.map((name, idx) => ({ id: idx, name })),
      };

      // Optimistically add to albumDetails
      queryClient.setQueryData<AlbumDetailData>(
        ["albumDetails", review.discogsId],
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
                  ).toFixed(2)
                )
              : review.ratingNumber;

          return {
            ...old,
            reviews: [tempReview, ...old.reviews],
            review_count: newReviewCount,
            average_rating: newAverageRating,
          };
        }
      );

      // Optimistically add to reviews list
      queryClient.setQueryData<Review[]>(["reviews", username], (old) => [
        tempReview,
        ...(old || []),
      ]);

      return snapshots;
    },

    onSuccess: (serverData, variables) => {
      // Update with real server data
      queryClient.setQueryData<AlbumDetailData>(
        ["albumDetails", variables.discogsId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            reviews: old.reviews.map((r) =>
              r.id < 0 && r.rating === serverData.rating ? serverData : r
            ),
          };
        }
      );

      queryClient.setQueryData<Review[]>(["reviews", username], (old) =>
        old
          ? old.map((r) =>
              r.id < 0 && r.rating === serverData.rating ? serverData : r
            )
          : old
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["reviews", username],
      });
      queryClient.invalidateQueries({
        queryKey: ["activity", username],
      });
      queryClient.invalidateQueries({
        queryKey: ["albumDetails", variables.discogsId],
      });
    },
    onError: (error, variables, context) => {
      //show toast here
      console.log("ERROR: ", error);
      console.error("Failed to create review:", error);

      // Rollback optimistic updates
      if (context?.album) {
        queryClient.setQueryData(
          ["albumDetails", variables.discogsId],
          context.album
        );
      }
      if (context?.reviews) {
        queryClient.setQueryData(["reviews", username], context.reviews);
      }
      if (context?.activity) {
        queryClient.setQueryData(["activity", username], context.activity);
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
      discogsId,
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
        queryClient.cancelQueries({ queryKey: ["reviews", username] }),
        queryClient.cancelQueries({ queryKey: ["activity", username] }),
        queryClient.cancelQueries({
          queryKey: ["albumDetails", vars.discogsId],
        }),
      ]);

      const snapshots = {
        reviews: queryClient.getQueryData(["reviews", username]),
        activity: queryClient.getQueryData(["activity", username]),
        album: queryClient.getQueryData(["albumDetails", vars.discogsId]),
      };

      // Optimistic: albumDetails
      queryClient.setQueryData<AlbumDetailData>(
        ["albumDetails", vars.discogsId],
        (old) => {
          if (!old) return old;
          const updatedReviews = old.reviews.map((r) =>
            r.id === vars.reviewId
              ? {
                  ...r,
                  rating: vars.ratingNumber,
                  description: vars.description,
                  genres: vars.genres,
                  is_liked_by_user: r.is_liked_by_user,
                }
              : r
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
                  ).toFixed(2)
                )
              : vars.ratingNumber;
          return {
            ...old,
            reviews: updatedReviews,
            average_rating: updatedAverageRating,
          };
        }
      );

      // Optimistic: reviews
      queryClient.setQueryData<Review[]>(["reviews", username], (old) =>
        old
          ? old.map((r) =>
              r.id === vars.reviewId
                ? {
                    ...r,
                    rating: vars.ratingNumber,
                    description: vars.description,
                    genres: vars.genres,
                    is_liked_by_user: r.is_liked_by_user,
                  }
                : r
            )
          : old
      );

      // Optimistic: activity
      queryClient.setQueryData<Activity[]>(["activity", username], (old) =>
        old
          ? old.map((a) =>
              a.review_details && a.review_details.id === vars.reviewId
                ? {
                    ...a,
                    review_details: {
                      ...a.review_details,
                      rating: vars.ratingNumber,
                      description: vars.description,
                      genres: vars.genres,
                      is_liked_by_user: a.review_details.is_liked_by_user,
                    },
                  }
                : a
            )
          : old
      );

      return snapshots;
    },

    onError: (_err, vars, ctx) => {
      ctx?.reviews &&
        queryClient.setQueryData(["reviews", username], ctx.reviews);
      ctx?.activity &&
        queryClient.setQueryData(["activity", username], ctx.activity);
      ctx?.album &&
        queryClient.setQueryData(["albumDetails", vars.discogsId], ctx.album);
    },

    onSuccess: (serverData) => {
      // Merge server truth into cache
      queryClient.setQueryData<AlbumDetailData>(
        ["albumDetails", serverData.album_discogs_id],
        (old) =>
          old
            ? {
                ...old,
                reviews: old.reviews.map((r) =>
                  r.id === serverData.id ? serverData : r
                ),
              }
            : old
      );

      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["reviews", username],
      });
      queryClient.invalidateQueries({
        queryKey: ["activity", username],
      });
      queryClient.invalidateQueries({
        queryKey: ["albumDetails", serverData.album_discogs_id],
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
