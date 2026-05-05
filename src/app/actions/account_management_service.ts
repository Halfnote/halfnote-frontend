"use server";
import { cookies } from "next/headers";

// Remove trailing slash from BASE_URL to prevent double slashes
const BASE_URL = (process.env.BASE_URL || `http://localhost:8000`).replace(
  /\/$/,
  "",
);
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
  username: string,
) {
  try {
    console.log("createSession: Starting session creation for", username);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const cookieStore = await cookies();

    // Use secure cookies only in production (HTTPS)
    const isProduction = process.env.NODE_ENV === "production";
    console.log("createSession: isProduction =", isProduction);

    cookieStore.set("access", access_token, {
      httpOnly: true,
      secure: isProduction,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
    console.log("createSession: Set access token cookie");

    cookieStore.set("refresh", refresh_token, {
      httpOnly: true,
      secure: isProduction,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
    console.log("createSession: Set refresh token cookie");

    cookieStore.set("username", username, {
      httpOnly: false,
      path: "/",
    });
    console.log("createSession: Set username cookie");
    console.log("createSession: Session creation completed successfully");
  } catch (error) {
    console.error("createSession: Error occurred", error);
    throw error;
  }
}

export const EditProfile = async (
  name?: string,
  bio?: string,
  location?: string,
  avatar?: File,
  banner?: File,
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access")?.value;

    if (!accessToken) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    if (name) formData.append("name", name);
    if (bio) formData.append("bio", bio);
    if (location) formData.append("location", location);
    if (avatar) formData.append("avatar", avatar);
    if (banner) formData.append("banner", banner);

    const response = await fetch(`${BASE_URL}/accounts/profile/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      let errorMessage = "Failed to edit profile";
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || error.detail || JSON.stringify(error);
      } catch {
        errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error("Profile edit failed:", error);
    throw error;
  }
};

export const RegisterUser = async (
  username: string,
  email: string,
  password: string,
  bio?: string,
  avatar?: File,
) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (bio) formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);
    const response = await fetch(`${BASE_URL}/accounts/register/`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || data.detail || "Registration failed",
      );
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
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Could not logout",
    );
  }
};
//assumes no cookies are set
export const LoginUser = async (
  username: string,
  password: string,
): Promise<void> => {
  try {
    console.log("LoginUser: Starting login for", username);
    console.log("LoginUser: BASE_URL =", BASE_URL);
    console.log("LoginUser: Full URL =", `${BASE_URL}/accounts/login/`);

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

    console.log("LoginUser: Response status", response.status);
    console.log(
      "LoginUser: Response content-type",
      response.headers.get("content-type"),
    );

    // Get the response text first to see what we're actually receiving
    const responseText = await response.text();
    console.log(
      "LoginUser: Response text (first 500 chars):",
      responseText.substring(0, 500),
    );

    if (!response.ok) {
      let error;
      try {
        error = JSON.parse(responseText);
      } catch {
        error = { message: responseText };
      }
      console.log("LoginUser: Error response", error);
      throw new Error(error.message || "Login failed");
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "LoginUser: Failed to parse response as JSON. Response was:",
        responseText,
      );
      throw new Error("Server returned invalid JSON response");
    }
    console.log("LoginUser: Success data received", data);

    if (!data.access_token || !data.refresh_token) {
      console.log("LoginUser: Missing token data");
      throw new Error("Invalid token data received");
    }

    console.log("LoginUser: Creating session...");
    // Create session with tokens
    await createSession(data.access_token, data.refresh_token, username);
    console.log("LoginUser: Session created successfully");
  } catch (error: unknown) {
    // Log the actual error for debugging
    console.error("LoginUser: Error occurred", error);
    // Re-throw the error for the component to handle
    throw new Error(
      error instanceof Error ? error.message : "An error occurred during login",
    );
  }
};
