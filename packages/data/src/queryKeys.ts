/**
 * Centralized React Query cache key factory
 * This ensures consistency across the app and prevents cache key mismatches
 *
 * Usage:
 *   - queryKeys.user() → ["user"]
 *   - queryKeys.reviews(username) → ["reviews", username]
 *   - queryKeys.activity(username, type) → ["activity", username, type]
 */

import type { ActivityFilterType } from "./types";

export const queryKeys = {
  // Artist details
  artistDetails: (artistName: string) => ["artistDetails", artistName] as const,
  // User authentication & profile
  user: () => ["user"] as const,
  profile: (userId: string | number) => ["profile", userId] as const,

  // User reviews
  reviews: () => ["reviews"],
  reviewsByUser: (username: string) => ["reviews", username] as const,
  reviewsByUserList: () => [...queryKeys.reviews(), "byUser"],

  // Activity feeds
  activity: () => ["activity"],
  activityByUser: (username: string) => ["activity", username] as const,
  othersActivity: (username: string, type: ActivityFilterType) =>
    ["other", username, type] as const,

  // Albums & album details
  albums: () => ["albums"],
  albumDetails: (discogsId: string) => ["albumDetails", discogsId] as const,

  // Search
  search: () => ["search"],
  searchAlbums: (query: string) => ["searchAlbum", query] as const,
  searchUsers: (query: string) => ["searchUsers", query] as const,
  searchArtists: (query: string) => ["searchArtists", query] as const,
  recentlyViewed: () => ["recentlyViewed"] as const,
  // Discovery
  discovery: () => ["discovery"],
  newReleases: (limit: number) => ["newReleases", limit] as const,
  popularAlbums: (limit: number) => ["popularAlbums", limit] as const,

  // Lists
  lists: () => ["lists"],
  listsByUser: (username: string) => ["lists", username] as const,
} as const;
