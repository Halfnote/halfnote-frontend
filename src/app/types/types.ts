export interface User {
  id: number;
  username: string;
  email?: string;
  name?: string;
  display_name: string;
  bio?: string;
  location?: string;
  avatar?: string;
  favorite_genres?: Genre[];
  most_reviewed_genres?: Genre[];
  follower_count: number;
  following_count: number;
  review_count?: number;
  pinned_reviews?: Review[];
  is_following?: boolean;
  is_staff?: boolean;
  favorite_albums: Album[];
}

export interface Genre {
  id: number;
  name: string;
  count?: number; // only present in `most_reviewed_genres`
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
  cover_url?: string;
  cover_image?: string;
  genres?: string[];
  discogs_id: number;
}

export interface Review {
  id: number;
  username: string;
  user_avatar: string;
  user_is_staff: boolean;
  rating: number;
  content: string;
  created_at: string;
  album_title: string;
  album_artist: string;
  album_cover: string;
  album_year?: number;
  is_pinned: boolean;
  likes_count: number;
  is_liked_by_user: boolean;
  comments_count: number;
  user_genres: Array<{ id: number; name: string }>;
}

export interface Comment {
  id: number;
  user: User;
  content: string;
  created_at: string;
}

export interface SearchResult {
  id: string;
  discogs_id?: string;
  title: string;
  artist: string;
  year?: number;
  cover_image?: string;
  thumb?: string;
  genre?: string[];
  style?: string[];
}
