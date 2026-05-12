/**
 * Centralized API endpoint definitions
 * Single source of truth for all backend API routes
 *
 * Usage:
 *   fetch(`${ENDPOINTS.music.albums(id).path()}`)
 *   ENDPOINTS.accounts.login.path()
 */

const BASE_URL = (
  process.env.BASE_URL || "https://halfnote-backend.vercel.app/api"
).replace(/\/$/, "");

/**
 * Helper to construct full URLs
 */
const endpoint = (path: string) => `${BASE_URL}${path}`;

/**
 * Accounts & Authentication endpoints
 */
const accounts = {
  login: {
    path: () => endpoint("/accounts/login/"),
    method: "POST",
  },
  register: {
    path: () => endpoint("/accounts/register/"),
    method: "POST",
  },
  profile: {
    path: () => endpoint("/accounts/profile/"),
    method: "GET",
    edit: () => ({
      path: () => endpoint("/accounts/profile/"),
      method: "PUT",
    }),
  },
  users: {
    search: (query: string) => ({
      path: () =>
        endpoint(`/accounts/users/search/?q=${encodeURIComponent(query)}`),
      method: "GET",
    }),
    profile: (username: string) => ({
      path: () => endpoint(`/accounts/users/${username}/`),
      method: "GET",
    }),
    reviews: (username: string) => ({
      path: () => endpoint(`/accounts/users/${username}/reviews/`),
      method: "GET",
    }),
    activity: (username: string) => ({
      path: () => endpoint(`/accounts/users/${username}/activity/`),
      method: "GET",
    }),
  },
};

/**
 * Music & Reviews endpoints
 */
const music = {
  albums: (discogsId: string) => ({
    path: () => endpoint(`/music/albums/${discogsId}/`),
    method: "GET",
    review: () => ({
      path: () => endpoint(`/music/albums/${discogsId}/review/`),
      method: "POST",
    }),
  }),
  search: (query: string) => ({
    path: () => endpoint(`/music/search/?q=${encodeURIComponent(query)}`),
    method: "GET",
  }),
  reviews: {
    edit: (reviewId: number) => ({
      path: () => endpoint(`/music/reviews/${reviewId}/`),
      method: "PUT",
    }),
    like: (reviewId: number) => ({
      path: () => endpoint(`/music/reviews/${reviewId}/like/`),
      method: "POST",
    }),
  },
  activity: {
    path: (type: string) =>
      endpoint(`/music/activity/?type=${encodeURIComponent(type)}`),
    method: "GET",
  },
  lists: {
    path: () => endpoint("/music/lists/"),
    method: "POST",
  },
  discovery: {
    newReleases: (limit: number) =>
      endpoint(`/music/discovery/new-releases/?limit=${limit}`),
    popular: (limit: number) =>
      endpoint(`/music/discovery/popular/?limit=${limit}`),
  },
};

/**
 * Exported API endpoints object
 * Access via: ENDPOINTS.music.albums(id).path()
 */
export const ENDPOINTS = {
  accounts,
  music,
} as const;

export { BASE_URL };
