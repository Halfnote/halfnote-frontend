"use server";
import { verifySession } from "./dal";
const BASE_URL = process.env.BASE_URL || `http://localhost:8000`;

export const CreateReview = async (
  discogsID: string,
  ratingNumber: number,
  description: string
) => {
  fetch(`${BASE_URL}/music/albums/${discogsID}/review/`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating: ratingNumber,
      content: description,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
};

export const likeReview = async (reviewId: number) => {
  console.log(BASE_URL);
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        credentials: "include",
        next: { revalidate: 3600 },
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
