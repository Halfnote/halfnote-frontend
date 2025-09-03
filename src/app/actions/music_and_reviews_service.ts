import { verifySession } from "./dal";

const BASE_URL =
  process.env.BASE_URL || `https://halfnote-backend.vercel.app/api`;

export const getAlbumDetails = async (discogsID: string) => {
  console.log("REFETCHING ALBUM DETAILS");
  try {
    const session = await verifySession();
    const response = await fetch(`${BASE_URL}/music/albums/${discogsID}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Could not get albums for ${discogsID}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Album fetch failed:", error);
    throw new Error(error.message || "Failed to get album details");
  }
};

export const getSearch = async (discogsID: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/music/search/?q=${encodeURIComponent(discogsID)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Could not get albums for ${discogsID}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Album fetch failed:", error);
    throw new Error(error.message || "Failed to get album details");
  }
};

export const getUserReviews = async (username: string) => {
  console.log("REFETCHING USER REVIEWS");
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
        next: { revalidate: 0 },
        cache: "no-store",
      }
    );
    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error: any) {
    console.error("Profile fetch failed:", error);
    throw new Error(error.message || "Failed to get profile");
  }
};

export const getUserActivity = async (username: string) => {
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
        next: { revalidate: 0 },
        cache: "no-store",
      }
    );
    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error: any) {
    console.error("Profile fetch failed:", error);
    throw new Error(error.message || "Failed to get activity");
  }
};

export const getOthersActivity = async (username: string, type: string) => {
  const session = await verifySession();
  try {
    const response = await fetch(`${BASE_URL}/music/activity/?type=${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      credentials: "include",
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Could not get ${type} activity`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Profile fetch failed:", error);
    throw new Error(error.message || "Failed to get profile");
  }
};
