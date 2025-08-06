import { verifySession } from "./dal";
const BASE_URL =
  process.env.BASE_URL || `https://halfnote-backend.vercel.app/api`;

export const createReview = async (
  discogsID: string,
  ratingNumber: number,
  description: string,
  genres: string[]
) => {
  const session = await verifySession();
  try {
    const response = await fetch(
      `${BASE_URL}/music/albums/${discogsID}/review/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          rating: ratingNumber,
          content: description,
          genres,
        }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create review");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Review creation failed:", error);
    throw new Error(error.message || "Failed to create review");
  }
};

export const editReview = async (
  reviewId: number,
  ratingNumber: number,
  description: string,
  genres: string[]
) => {
  const session = await verifySession();
  try {
    const response = await fetch(`${BASE_URL}/music/reviews/${reviewId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        rating: ratingNumber,
        content: description,
        genres,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to edit review");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Review edit failed:", error);
    throw new Error(error.message || "Failed to edit review");
  }
};

export const toggleLike = async (reviewId: number) => {
  const session = await verifySession();
  if (!session?.access_token) {
    throw new Error("No valid session");
  }
  try {
    const response = await fetch(
      `${BASE_URL}/music/reviews/${reviewId}/like/`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Could not like review");
    }
    return await response.json();
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to like review");
  }
};
