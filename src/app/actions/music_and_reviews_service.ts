"use server";
import { verifySession } from "./dal";

const BASE_URL = (
  process.env.BASE_URL || "https://halfnote-backend.vercel.app/api"
).replace(/\/$/, "");

export const getAlbumDetails = async (discogsID: string) => {
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
  } catch (error: unknown) {
    console.error("Album fetch failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get album details",
    );
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
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Could not get albums for ${discogsID}`);
    }
    return await response.json();
  } catch (error: unknown) {
    console.error("Album fetch failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get album details",
    );
  }
};

export const getSearchArtists = async (query: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/music/search/artists/?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Could not get artists for ${query}`);
    }
    return await response.json();
  } catch (error: unknown) {
    console.error("Artist search failed:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get artist search results",
    );
  }
};

export const getSearchUsers = async (query: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/accounts/users/search/?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Could not get users for ${query}`);
    }
    return await response.json();
  } catch (error: unknown) {
    console.error("User search failed:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get user search results",
    );
  }
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
        next: { revalidate: 0 },
        cache: "no-store",
      },
    );
    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error: unknown) {
    console.error("Profile fetch failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get profile",
    );
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
      },
    );
    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error: unknown) {
    console.error("Profile fetch failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get activity",
    );
  }
};

export const getOthersActivity = async (username: string, type: string) => {
  const session = await verifySession();
  try {
    const url = `${BASE_URL}/music/activity/?type=${type}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Could not get ${type} activity: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to get activity",
    );
  }
};

export const getNewReleases = async (limit: number = 10) => {
  try {
    const response = await fetch(
      `${BASE_URL}/music/discovery/new-releases/?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Could not get new releases`);
    }
    return await response.json();
  } catch (error: unknown) {
    console.error("New releases fetch failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get new releases",
    );
  }
};

export const getPopularAlbums = async (limit: number = 10) => {
  try {
    const response = await fetch(
      `${BASE_URL}/music/discovery/popular/?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Could not get popular albums`);
    }
    return await response.json();
  } catch (error: unknown) {
    console.error("Popular albums fetch failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get popular albums",
    );
  }
};

export const getArtistDetails = async (artistName: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/music/artists/${encodeURIComponent(artistName)}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Could not get artist details for ${artistName}`,
      );
    }
    return await response.json();
  } catch (error: unknown) {
    console.error("Artist details fetch failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get artist details",
    );
  }
};
