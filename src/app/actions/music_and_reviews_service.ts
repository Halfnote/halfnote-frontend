"use server";
import { cache } from "react";
import { verifySession } from "./dal";

const BASE_URL = process.env.BASE_URL || `http://localhost:8000`;

//need to debounce this in the fe
export const searchAlbums = async (query: string) => {
  const encodedQuery = encodeURIComponent(query);
  await fetch(`${BASE_URL}/api/music/search/?q=${encodedQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.results);
    });
};

export const AlbumDetails = async (discogsID: string) => {
  fetch(`${BASE_URL}/music/albums/${discogsID}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
};

export const getUserReviews = cache(async (username: string) => {
  console.log("called with, ", username);
  const session = await verifySession();
  try {
    const response = await fetch(
      `${BASE_URL}/accounts/users/${username}/reviews/`,
      {
        method: "GET",
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
      throw new Error(error.message || "Could not get profile data");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Profile fetch failed:", error);
    throw new Error(error.message || "Failed to get profile");
  }
});
