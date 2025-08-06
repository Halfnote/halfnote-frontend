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
  album_discogs_id?: string;
  text: string;
  user: User;
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

export interface AlbumDetailData {
  album: AlbumData;
  reviews: Review[];
  review_count: number;
  average_rating: number | null;
  exists_in_db: boolean;
  cached: boolean;
}

export interface AlbumData {
  id?: string;
  title: string;
  artist: string;
  year?: number;
  cover_url?: string;
  cover_image?: string;
  discogs_id: string;
  genres?: string[];
  discogs_genres?: string[];
  discogs_styles?: string[];
  tracklist?: Array<{
    position: string;
    title: string;
    duration?: string;
    artists?: Array<{ name: string }>;
  }>;
  credits?: Array<{
    name: string;
    role: string;
  }>;
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
export interface Activity {
  id: number;
  activity_type:
    | "review_liked"
    | "review_created"
    | "review_pinned"
    | "user_followed"
    | "comment_created";
  comment_details: string | null;
  created_at: string;

  user: {
    username: string;
    avatar: string;
    is_staff?: boolean;
  };

  target_user: {
    username: string;
    avatar: string;
    is_staff?: boolean;
  } | null;

  review_details: {
    id: number;
    rating: number;
    content: string;
    is_liked_by_user: boolean;
    likes_count: number;
    comments_count: number;
    album: {
      discogs_id: string;
      title: string;
      artist: string;
      cover_url: string;
      year: number;
    };
    user_genres: Array<{ id: number; name: string }>;
  };
}
