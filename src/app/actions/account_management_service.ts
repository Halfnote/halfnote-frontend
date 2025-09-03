"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { StaticImageData } from "next/image";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./dal";
import { redirect } from "next/navigation";

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
  email: string,
  password: string,
  bio?: string,
  avatar?: File
) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (bio) formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);
    console.log("formdata: ", JSON.stringify(formData));
    const response = await fetch(`${BASE_URL}/accounts/register/`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.detail || "Registration failed");
    }

    if (!data.access_token || !data.refresh_token) {
      throw new Error("Invalid token data received");
    }

    await createSession(data.access_token, data.refresh_token, username);
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("access");
  cookieStore.delete("refresh");
  cookieStore.delete("username");
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
      credentials: "include",
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
    console.log("data login: ", data);

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
