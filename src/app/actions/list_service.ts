import { verifySession } from "./dal";

const BASE_URL =
  process.env.BASE_URL || `https://halfnote-backend.vercel.app/api`;

export const CreateList = async (
  name: string,
  description?: string,
  is_public?: boolean
): Promise<void> => {
  const session = await verifySession();

  const response = await fetch(`${BASE_URL}/music/lists/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      name,
      description,
      is_public,
    }),
  });

  console.log(response);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Create Album List failed");
  }

  const data = await response.json();
  console.log(data);
};
