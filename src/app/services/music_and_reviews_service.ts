const BASE_URL = process.env.BASE_URL || `http://localhost:8000`;

//need to debounce this in the fe
export const searchAlbums = async (query: string) => {
  const encodedQuery = encodeURIComponent(query);
  await fetch(`${BASE_URL}/api/music/search/?q=${encodedQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.results);
    });
};

export const AlbumDetails = async (discogsID: string) => {
  fetch(`${BASE_URL}/music/albums/${discogsID}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
};
