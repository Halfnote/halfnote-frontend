const BASE_URL = process.env.BASE_URL || `http://localhost:8000`;

export const CreateReview = async (
  discogsID: string,
  ratingNumber: number,
  description: string
) => {
  fetch(`${BASE_URL}/music/albums/${discogsID}/review/`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating: ratingNumber,
      content: description,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
};

export const getUserReview = async (username: string) => {
  const response = await fetch(
    `${BASE_URL}/api/accounts/users/${username}/reviews/`,
    {
      cache: "force-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch reviews for ${username}`);
  }
  return await response.json();
};
