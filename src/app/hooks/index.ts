import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/actions/dal";
import {
  getOthersActivity,
  getUserActivity,
  getUserReviews,
} from "@/app/actions/music_and_reviews_service";
import { toggleLike } from "@/app/actions/reviews_service";
import { useQueryClient } from "@tanstack/react-query";
import { User, Activity, Review } from "../types/types";

export const useUser = () =>
  useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: () => getUser(),
    staleTime: 1000 * 60 * 30, //grabbing from cache for 30 minutes
  });

export const useUserReviews = (username: string) =>
  useQuery({
    queryKey: ["reviews", username],
    queryFn: () => getUserReviews(username),
    enabled: !!username,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

export const useToggleReview = (username: string) => {
  const queryClient = useQueryClient();

  return useMutation({
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

      // Optimistically update reviews
      queryClient.setQueryData<Review[]>(["reviews", username], (old = []) =>
        old.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                is_liked_by_user: !r.is_liked_by_user,
                likes_count: r.is_liked_by_user
                  ? r.likes_count - 1
                  : r.likes_count + 1,
              }
            : r
        )
      );

      // Optimistically update activity data
      queryClient.setQueryData<Activity[]>(["activity", username], (old = []) =>
        old.map((activity) => {
          if (
            activity.review_details &&
            activity.review_details.id === reviewId
          ) {
            return {
              ...activity,
              review_details: {
                ...activity.review_details,
                is_liked_by_user: !activity.review_details.is_liked_by_user,
                likes_count: activity.review_details.is_liked_by_user
                  ? activity.review_details.likes_count - 1
                  : activity.review_details.likes_count + 1,
              },
            };
          }
          return activity;
        })
      );

      return { previousReviews, previousActivity };
    },
    onError: (_error, _reviewId, context: any) => {
      //TODO some sort of toast that says an error has occured
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
      // Invalidate and refetch both queries after mutation completes
      queryClient.invalidateQueries({ queryKey: ["reviews", username] });
      queryClient.invalidateQueries({ queryKey: ["activity", username] });
    },
  });
};

export const useUserActivity = (username: string) =>
  useQuery<Activity[], Error>({
    queryKey: ["activity", username],
    queryFn: () => getUserActivity(username),
    enabled: !!username,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

export const userOthersActivity = (
  username: string,
  type: "friends" | "you" | "incoming"
) =>
  useQuery<Activity[], Error>({
    queryKey: ["other", username, type],
    queryFn: () => getOthersActivity(username, type),
    enabled: !!username && !!type,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // data is fresh for 5 min
  });
