import { unstable_cache } from "next/cache";
import { StaticImageData } from "next/image";

const BASE_URL = process.env.BASE_URL || `http://localhost:8000`;

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

export const LoginUser = async (username: string, password: string) => {
  fetch(`${BASE_URL}/accounts/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    });
};
