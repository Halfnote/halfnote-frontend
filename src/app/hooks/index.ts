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
  useQuery<User | null, Error>({
    queryKey: ["user"],
    queryFn: () => getUser(),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

export const useUserReviews = (username: string) =>
  useQuery<Review[]>({
    queryKey: ["reviews", username],
    queryFn: async () => {
      const res = await getUserReviews(username);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!username,
  });

export const useToggleReview = (username: string, discogsId?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
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

      // Background refetch — no UI flicker
      queryClient.refetchQueries({
        queryKey: ["reviews", username],
        type: "inactive",
      });
      queryClient.refetchQueries({
        queryKey: ["activity", username],
        type: "inactive",
      });
      discogsId &&
        queryClient.refetchQueries({
          queryKey: ["albumDetails", discogsId],
          type: "inactive",
        });
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
    queryFn: async () => {
      const res = await getUserActivity(username);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!username,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
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
  const queryClient = useQueryClient();

  const getFromCache = (key: string[]) => {
    return queryClient.getQueryData(key);
  };

  const key = ["searchAlbum", discogsID];
  return useQuery({
    queryKey: ["searchAlbum", discogsID],
    queryFn: async () => {
      const cachedData = getFromCache(key);
      if (cachedData) {
        return cachedData;
      }
      // If no cached data, fetch from the server
      return await getSearch(discogsID);
    },
    enabled: !!discogsID && discogsID.length > 0,
    refetchOnWindowFocus: false,
  });
};

export const useAlbumDetails = (discogsID: string) => {
  return useQuery<AlbumDetailData, Error>({
    queryKey: ["albumDetails", discogsID],
    queryFn: () => getAlbumDetails(discogsID),
    enabled: !!discogsID,
    refetchOnMount: true,
  });
};
export const useCreateReview = (username: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
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

      const snapshot = queryClient.getQueryData([
        "albumDetails",
        review.discogsId,
      ]);
      return { snapshot };
    },

    onSuccess: (data, variables) => {
      // Invalidate and immediately refetch
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["reviews", username],
          refetchType: "inactive",
        }),
        queryClient.invalidateQueries({
          queryKey: ["activity", username],
          refetchType: "inactive",
        }),
        queryClient.refetchQueries({
          queryKey: ["albumDetails", variables.discogsId],
          type: "inactive",
        }),
      ]);
    },
    onError: (error, newDetails, context) => {
      //show toast here
      console.log("ERROR: ", error);
      console.error("Failed to create review:", error);
      queryClient.setQueryData(
        ["albumDetails", newDetails.discogsId],
        context?.snapshot
      );
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

      // Background refetch — avoids flicker
      queryClient.refetchQueries({
        queryKey: ["reviews", username],
        type: "inactive",
      });
      queryClient.refetchQueries({
        queryKey: ["activity", username],
        type: "inactive",
      });
      queryClient.refetchQueries({
        queryKey: ["albumDetails", serverData.album_discogs_id],
        type: "inactive",
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

// // Keep the old hook for backward compatibility, but it now uses the appropriate specific hook
// export const useWriteReview = (username: string) => {
//   const createReviewMutation = useCreateReview(username);
//   const editReviewMutation = useEditReview(username);

//   return {
//     mutate: (variables: {
//       discogsId: string;
//       id: string | number;
//       ratingNumber: number;
//       description: string;
//       genres: string[];
//     }) => {
//       if (typeof variables.id === "string") {
//         // Creating a new review
//         createReviewMutation.mutate({
//           discogsId: variables.discogsId,
//           ratingNumber: variables.ratingNumber,
//           description: variables.description,
//           genres: variables.genres,
//         });
//       } else {
//         // Editing an existing review
//         editReviewMutation.mutate({
//           reviewId: variables.id,
//           discogsId: variables.discogsId,
//           ratingNumber: variables.ratingNumber,
//           description: variables.description,
//           genres: variables.genres,
//         });
//       }
//     },
//     isPending: createReviewMutation.isPending || editReviewMutation.isPending,
//     isError: createReviewMutation.isError || editReviewMutation.isError,
//   };
// };
