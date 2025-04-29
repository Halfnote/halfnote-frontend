export type Review = {
  id: string;
  user: {
    id: number;
    username: string;
  };
  album: {
    id: string;
    title: string;
    artist: {
      id: number;
      name: string;
    };
    cover_art_url: string;
  };
  rating: number;
  text: string;
  created_at: string;
  updated_at: string;
};

export type ReviewResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Review[];
};
