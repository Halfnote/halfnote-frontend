"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { StaticImageData } from "next/image";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL || `http://localhost:8000`;
const secretKey = process.env.SESSION_SECRET!;
// export async function decrypt(session: string | undefined = "") {
//   if (!session) {
//     throw new Error("No session token provided");
//   }

//   try {
//     // Add more detailed logging for debugging
//     console.log(
//       "Attempting to verify token with secret length:",
//       secretKey.length
//     );

//     const { payload } = await jwtVerify(
//       session,
//       new TextEncoder().encode(secretKey),
//       {
//         algorithms: ["HS256"],
//       }
//     );
//     return payload;
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     throw error; // Throw the original error for better debugging
//   }
// }

export async function createSession(
  access_token: string,
  refresh_token: string,
  username: string
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();
  

  cookieStore.set("access", access_token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("refresh", refresh_token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("username", username, {
    httpOnly: false,
    path: "/",
  });
}

export const RegisterUser = async (
  username: string,
  password: string,
  bio?: string,
  avatar_url?: StaticImageData
) => {
  fetch(`${BASE_URL}/accounts/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
      bio: bio,
      avatar_url: avatar_url,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    });
};

export async function deleteSession() {
  // Destroy the session
  const cookieStore = await cookies();
  cookieStore.delete("access");
}

export const logoutUser = async () => {
  try {
    await deleteSession();
  } catch (error: any) {
    throw new Error(error.message || "Could not logout");
  }
};
//assumes no cookies are set
export const LoginUser = async (
  username: string,
  password: string
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/accounts/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();

    if (!data.access_token || !data.refresh_token) {
      throw new Error("Invalid token data received");
    }

    // Create session with tokens
    await createSession(data.access_token, data.refresh_token, username);
  } catch (error: any) {
    // Re-throw the error for the component to handle
    throw new Error(error.message || "An error occurred during login");
  }
};

// export const getOwnProfile = async () => {
//   try {
//     const response = await fetch(`${BASE_URL}/accounts/profile/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Could not get profile data");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.error || "Failed to get profile");
//   }
// };
