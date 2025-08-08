import { verifySession } from "./dal";

const BASE_URL =
  process.env.BASE_URL || `https://halfnote-backend.vercel.app/api`;

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

export const getUserReviews = async (username: string) => {
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
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Could not get reviews for ${username}`);
    }
    return await response.json();
  } catch (error: unknown) {
    const err = error as { message: string };
    console.error("Profile fetch failed:", err);
    throw new Error(err.message || "Failed to get profile");
  }
};

export const getUserActivity = async (username: string) => {
  console.log("getting user activity");
  const session = await verifySession();
  try {
    const response = await fetch(
      `${BASE_URL}/accounts/users/${username}/activity/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Could not get activity for ${username}`
      );
    }
    return await response.json();
  } catch (error: unknown) {
    const err = error as { message: string };
    console.error("Profile fetch failed:", err);
    throw new Error(err.message || "Failed to get activity");
  }
};

export const getOthersActivity = async (username: string, type: string) => {
  console.log("getting OTHERS");
  console.log("type: ", type);
  const session = await verifySession();
  try {
    const response = await fetch(`${BASE_URL}/music/activity/?type=${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Could not get ${type} activity`);
    }
    return await response.json();
  } catch (error: unknown) {
    const err = error as { message: string };
    console.error("Profile fetch failed:", err);
    throw new Error(err.message || "Failed to get profile");
  }
};
