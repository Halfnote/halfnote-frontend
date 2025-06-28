import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/actions/dal";
import { getUserReviews } from "@/app/actions/music_and_reviews_service";
//   import { getUserPinnedReviews } from "@/app/actions/music_and_reviews_service";
import { likeReview } from "@/app/actions/reviews_service";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../types/types";

export const useUser = () =>
  useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: () => getUser(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

export const useUserReviews = (username: string) =>
  useQuery({
    queryKey: ["reviews", username],
    queryFn: () => getUserReviews(username),
    enabled: !!username,
    refetchOnMount: false,
  });

export const useLikeReview = (username: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["likeReview"],
    mutationFn: (reviewId: number) => likeReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", username] });
    },
  });
};
