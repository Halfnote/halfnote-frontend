"use server";
import { cookies } from "next/headers";
import { cache } from "react";

const BASE_URL =
  process.env.BASE_URL || `https://halfnote-backend.vercel.app/api`;

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access")?.value;
  const username = cookieStore.get("username")?.value;

  if (!access_token) {
    return {
      isAuth: false,
      access_token: null,
      username: null,
    };
  }

  return {
    isAuth: true,
    access_token,
    username,
  };
});

export const getSafeSession = cache(async () => {
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  const hasAccess = !!cookieStore.get("access")?.value;

  return {
    isAuth: hasAccess,
    username: username || null,
  };
});

export const getUser = async () => {
  const session = await verifySession();
  if (!session?.access_token) {
    throw new Error("No valid session");
  }
  try {
    const response = await fetch(`${BASE_URL}/accounts/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Could not get profile data");
    }

    return await response.json();
  } catch (error: unknown) {
    console.error("Profile fetch failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get profile"
    );
  }
};
