// Private to @halfnote/data: the only place a Django URL, method, or body shape is written.
import type {
  Activity,
  ActivityFilterType,
  AlbumDetailData,
  FeedPage,
  ArtistDetails,
  RecentlyViewedResponse,
  Review,
  ReviewLikeResponse,
  SearchAlbumsResponse,
  SearchArtistsResponse,
  SearchUsersResponse,
  User,
} from "./types";

/** A web File/Blob, or the {uri, name, type} triple React Native's FormData accepts. */
export type Upload = Blob | { uri: string; name: string; type: string };

type Body =
  | { json?: undefined; form?: undefined }
  | { json: unknown; form?: undefined }
  | { json?: undefined; form: Record<string, string | Upload | undefined> };

export type Endpoint<T> = Body & {
  method: "GET" | "POST" | "PUT" | "DELETE";
  /** Relative to baseUrl. Django paths end in "/". */
  path: `/${string}/`;
  query?: Record<string, string | number>;
  /** Boundary parse. ponytail: a cast; add zod here if backend drift causes bugs. */
  parse: (raw: unknown) => T;
};

export interface Credentials {
  username: string;
  password: string;
}
export interface RegisterInput extends Credentials {
  email: string;
  bio?: string;
  avatar?: Upload;
}
export interface ReviewInput {
  discogsId: string;
  rating: number | null;
  headline: string;
  body: string;
  genres?: string[];
  /** A song on this album, or null for none. */
  favoriteSongId?: number | null;
}
export interface EditReviewInput {
  reviewId: number;
  rating: number | null;
  headline: string;
  body: string;
  genres?: string[];
  /** Left out keeps the current favourite; null clears it. */
  favoriteSongId?: number | null;
}
export interface EditProfileInput {
  name?: string;
  bio?: string;
  location?: string;
  avatar?: Upload;
  banner?: Upload;
}
export interface CreateListInput {
  name: string;
  description?: string;
  isPublic?: boolean;
}

const cast = <T>(raw: unknown) => raw as T;
const arrayOrEmpty = <T>(raw: unknown) => (Array.isArray(raw) ? (raw as T[]) : []);
const seg = encodeURIComponent;

export const endpoints = {
  profile: (): Endpoint<User> => ({ method: "GET", path: "/accounts/profile/", parse: cast }),
  editProfile: (input: EditProfileInput): Endpoint<User> => ({
    method: "PUT",
    path: "/accounts/profile/",
    // Empty strings are skipped, so a blank form field never clears the stored value.
    form: {
      name: input.name || undefined,
      bio: input.bio || undefined,
      location: input.location || undefined,
      avatar: input.avatar,
      banner: input.banner,
    },
    parse: cast,
  }),
  searchUsers: (q: string): Endpoint<SearchUsersResponse> => ({
    method: "GET",
    path: "/accounts/users/search/",
    query: { q },
    parse: cast,
  }),
  userReviews: (username: string): Endpoint<Review[]> => ({
    method: "GET",
    path: `/accounts/users/${seg(username)}/reviews/`,
    parse: arrayOrEmpty<Review>,
  }),
  userActivity: (username: string): Endpoint<Activity[]> => ({
    method: "GET",
    path: `/accounts/users/${seg(username)}/activity/`,
    parse: arrayOrEmpty<Activity>,
  }),
  othersActivity: (type: ActivityFilterType): Endpoint<Activity[]> => ({
    method: "GET",
    path: "/music/activity/",
    query: { type },
    parse: cast,
  }),
  albumDetails: (discogsId: string): Endpoint<AlbumDetailData> => ({
    method: "GET",
    path: `/music/albums/${seg(discogsId)}/`,
    parse: cast,
  }),
  searchAlbums: (q: string): Endpoint<SearchAlbumsResponse> => ({
    method: "GET",
    path: "/music/search/",
    query: { q },
    parse: cast,
  }),
  searchArtists: (q: string): Endpoint<SearchArtistsResponse> => ({
    method: "GET",
    path: "/music/search/artists/",
    query: { q },
    parse: cast,
  }),
  newReleases: (limit: number): Endpoint<SearchAlbumsResponse> => ({
    method: "GET",
    path: "/music/discovery/new-releases/",
    query: { limit },
    parse: cast,
  }),
  popularAlbums: (limit: number): Endpoint<SearchAlbumsResponse> => ({
    method: "GET",
    path: "/music/discovery/popular/",
    query: { limit },
    parse: cast,
  }),
  artistDetails: (name: string): Endpoint<ArtistDetails> => ({
    method: "GET",
    path: `/music/artists/${seg(name)}/`,
    parse: cast,
  }),
  createReview: (input: ReviewInput): Endpoint<Review> => ({
    method: "POST",
    path: `/music/albums/${seg(input.discogsId)}/review/`,
    // JSON.stringify drops an undefined key, so genres and the favourite song are sent only when set.
    json: { rating: input.rating, headline: input.headline, body: input.body, genres: input.genres, favorite_song_id: input.favoriteSongId },
    parse: cast,
  }),
  editReview: (input: EditReviewInput): Endpoint<Review> => ({
    method: "PUT",
    path: `/music/reviews/${input.reviewId}/`,
    json: { rating: input.rating, headline: input.headline, body: input.body, genres: input.genres, favorite_song_id: input.favoriteSongId },
    parse: cast,
  }),
  recentlyViewed: (): Endpoint<RecentlyViewedResponse> => ({
    method: "GET",
    path: "/music/recently-viewed/",
    parse: cast,
  }),
  recordView: (discogsId: string): Endpoint<void> => ({
    method: "POST",
    path: "/music/recently-viewed/",
    json: { discogs_id: discogsId },
    parse: () => undefined,
  }),
  /** `cursor` is opaque: lifted from the previous page's `next`, never built. */
  feed: (cursor?: string): Endpoint<FeedPage> => ({
    method: "GET",
    path: "/music/feed/",
    query: cursor ? { cursor } : undefined,
    parse: cast,
  }),
  /** PUT likes, DELETE unlikes; both idempotent. */
  setLike: (reviewId: number, liked: boolean): Endpoint<ReviewLikeResponse> => ({
    method: liked ? "PUT" : "DELETE",
    path: `/music/reviews/${reviewId}/like/`,
    parse: cast,
  }),
  createList: (input: CreateListInput): Endpoint<void> => ({
    method: "POST",
    path: "/music/lists/",
    json: { name: input.name, description: input.description, is_public: input.isPublic },
    parse: () => undefined,
  }),
};

export type Endpoints = typeof endpoints;
