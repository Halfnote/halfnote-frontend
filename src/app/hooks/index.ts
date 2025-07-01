import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/actions/dal";
import {
  getUserActivity,
  getUserReviews,
} from "@/app/actions/music_and_reviews_service";
import { toggleLike } from "@/app/actions/reviews_service";
import { useQueryClient } from "@tanstack/react-query";
import { User, Activity } from "../types/types";

export const useUser = () =>
  useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: () => getUser(),
    refetchOnWindowFocus: true,
  });

export const useUserReviews = (username: string) =>
  useQuery({
    queryKey: ["reviews", username],
    queryFn: () => getUserReviews(username),
    enabled: !!username,
  });

export const useToggleReview = (username: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggleLike"],
    mutationFn: (reviewId: number) => toggleLike(reviewId),
    onSuccess: () => {
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
  });
