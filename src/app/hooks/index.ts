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
    staleTime: 1000 * 60 * 60, //grabbing from cache for 60 minutes
  });

export const useUserReviews = (username: string) =>
  useQuery<Review[]>({
    queryKey: ["reviews", username],
    queryFn: () => getUserReviews(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

export const useToggleReview = (username: string, albumId?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: ["reviews", username] });
      await queryClient.cancelQueries({ queryKey: ["activity", username] });

      const previousReviews = queryClient.getQueryData<Review[]>([
        "reviews",
        username,
      ]);
      const previousActivity = queryClient.getQueryData<Activity[]>([
        "activity",
        username,
      ]);

      queryClient.setQueryData<Review[]>(["reviews", username], (old = []) =>
        old.map((r) => {
          if (r.id === reviewId) {
            const newIsLiked = !r.is_liked_by_user;
            return {
              ...r,
              is_liked_by_user: newIsLiked,
              likes_count: newIsLiked
                ? r.likes_count + 1 // If now liked, increment
                : r.likes_count - 1, // If now unliked, decrement
            };
          }
          return r;
        })
      );

      queryClient.setQueryData<Activity[]>(["activity", username], (old = []) =>
        old.map((activity) => {
          if (
            activity.review_details &&
            activity.review_details.id === reviewId
          ) {
            const newIsLiked = !activity.review_details.is_liked_by_user;
            return {
              ...activity,
              review_details: {
                ...activity.review_details,
                is_liked_by_user: newIsLiked,
                likes_count: newIsLiked
                  ? activity.review_details.likes_count + 1
                  : activity.review_details.likes_count - 1,
              },
            };
          }
          return activity;
        })
      );

      return { previousReviews, previousActivity };
    },
    onError: (_error, _reviewId, context: any) => {
      console.error("Toggle like error:", _error);
      if (context?.previousReviews) {
        queryClient.setQueryData(
          ["reviews", username],
          context.previousReviews
        );
      }
      if (context?.previousActivity) {
        queryClient.setQueryData(
          ["activity", username],
          context.previousActivity
        );
      }
    },
    mutationFn: (reviewId: number) => toggleLike(reviewId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", username] });
      queryClient.invalidateQueries({ queryKey: ["activity", username] });
      if (albumId) {
        queryClient.invalidateQueries({ queryKey: ["albumDetails", albumId] });
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
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

export const userOthersActivity = (
  username: string,
  type: "friends" | "you" | "incoming"
) =>
  useQuery<Activity[], Error>({
    queryKey: ["other", username, type],
    queryFn: () => getOthersActivity(username, type),
    enabled: !!username && !!type,
    staleTime: 1000 * 60 * 5, // data is fresh for 5 min
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
    staleTime: 1000 * 60 * 10,
  });
};

export const useAlbumDetails = (discogsID: string) => {
  return useQuery<AlbumDetailData, Error>({
    queryKey: ["albumDetails", discogsID],
    queryFn: () => getAlbumDetails(discogsID),
    enabled: !!discogsID,
    staleTime: 1000 * 60 * 10, // Always fetch fresh data
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

    onSuccess: async (data, variables) => {
      // Invalidate and immediately refetch
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["reviews", username],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: ["activity", username],
          refetchType: "active",
        }),
        queryClient.refetchQueries({
          queryKey: ["albumDetails", variables.discogsId],
          type: "active",
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

    onMutate: async (variables) => {
      // Cancel all related queries
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["reviews", username] }),
        queryClient.cancelQueries({ queryKey: ["activity", username] }),
        queryClient.cancelQueries({
          queryKey: ["albumDetails", variables.discogsId],
        }),
      ]);

      // Store snapshots for rollback
      return {
        reviewsSnapshot: queryClient.getQueryData(["reviews", username]),
        activitySnapshot: queryClient.getQueryData(["activity", username]),
        albumSnapshot: queryClient.getQueryData([
          "albumDetails",
          variables.discogsId,
        ]),
      };
    },

    onSuccess: async (data, variables) => {
      // Simply invalidate all related queries - let React Query refetch fresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reviews", username] }),
        queryClient.invalidateQueries({ queryKey: ["activity", username] }),
        queryClient.invalidateQueries({
          queryKey: ["albumDetails", variables.discogsId],
        }),
      ]);
    },

    onError: (error, variables, context) => {
      // Restore all snapshots on error
      if (context?.reviewsSnapshot) {
        queryClient.setQueryData(
          ["reviews", username],
          context.reviewsSnapshot
        );
      }
      if (context?.activitySnapshot) {
        queryClient.setQueryData(
          ["activity", username],
          context.activitySnapshot
        );
      }
      if (context?.albumSnapshot) {
        queryClient.setQueryData(
          ["albumDetails", variables.discogsId],
          context.albumSnapshot
        );
      }
    },
  });
  return {
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    editReviewMutation: mutation,
    isPending: mutation.isPending,
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
