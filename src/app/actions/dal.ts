"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decrypt } from "./account_management_service";
const BASE_URL = process.env.BASE_URL || `http://localhost:8000`;

export const verifySession = cache(async () => {
  try {
    const cookieStore = cookies();
    const access = (await cookieStore).get("access")?.value;
    const username = (await cookieStore).get("username")?.value;

    if (!access) {
      throw new Error("No access token found");
    }

    // const decrypted_access = await decrypt(access);

    // if (!decrypted_access) {
    //   throw new Error("Invalid access token");
    // }

    return {
      isAuth: true,
      access_token: access,
      username: username,
    };
  } catch (error) {
    console.error("Session verification failed:", error);
    redirect("/");
  }
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session?.access_token) {
    throw new Error("No valid session");
  }

  try {
    console.log("access in getUser: ", session.access_token);
    const response = await fetch(`${BASE_URL}/accounts/profile/`, {
      method: "GET", // Changed to GET since we're fetching data
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      credentials: "include",
      cache: "force-cache",
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
});
