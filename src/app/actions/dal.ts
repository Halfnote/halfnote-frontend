"use server";
import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
// import { decrypt } from "./account_management_service";
const BASE_URL =
  process.env.BASE_URL || `https://halfnote-backend.vercel.app/api`;

export const verifySession = cache(async () => {
  const cookieStore = cookies();
  const access = (await cookieStore).get("access")?.value;
  const username = (await cookieStore).get("username")?.value;

  if (!access) throw new Error("No access token found");

  return {
    isAuth: true,
    access_token: access,
    username,
  };
});

export const getUser = async () => {
  const session = await verifySession();
  if (!session?.access_token) {
    throw new Error("No valid session");
  }

  try {
    console.log("access in getUser: ", session.access_token);
    const response = await fetch(`${BASE_URL}/accounts/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      credentials: "include",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Could not get profile data");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Profile fetch failed:", error);
    throw new Error(error.message || "Failed to get profile");
  }
};
