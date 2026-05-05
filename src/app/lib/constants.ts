/**
 * Application-wide constants
 * Centralized place for all magic numbers, strings, and configuration values
 */

/**
 * Cache and stale time constants (in milliseconds)
 * These determine how long React Query keeps data as "fresh"
 * After staleTime, a refetch is triggered if the component remounts or window refocuses
 */
export const CACHE_TIMES = {
  // Activity feeds change frequently - check every 2 minutes
  ACTIVITY: 2 * 60 * 1000,

  // Albums rarely change - cache for 1 minute to balance freshness vs requests
  ALBUM_DETAILS: 1 * 60 * 1000,

  // Search results are relatively static - cache for 10 minutes
  SEARCH_RESULTS: 10 * 60 * 1000,

  // User search results - cache for 10 minutes
  USER_SEARCH: 10 * 60 * 1000,

  // Discovery data (new releases, popular) is fairly stable - cache for 1 hour
  DISCOVERY: 60 * 60 * 1000,
} as const;

/**
 * Garbage collection time (how long data stays in memory after unmounting)
 * Prevents refetch if user navigates back within this time
 */
export const GARBAGE_COLLECTION_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Token expiration times (in milliseconds)
 * Must match backend token lifetimes
 */
export const TOKEN_LIFETIMES = {
  ACCESS_TOKEN: 1 * 24 * 60 * 60 * 1000, // 1 day
  REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

/**
 * Cookie names
 */
export const COOKIE_NAMES = {
  ACCESS_TOKEN: "access",
  REFRESH_TOKEN: "refresh",
  USERNAME: "username",
} as const;

/**
 * Default image URLs
 */
export const DEFAULT_IMAGES = {
  AVATAR: "/default-avatar.png",
  ALBUM_COVER: "/default-album.png",
} as const;

/**
 * HTTP header constants
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE: "Content-Type",
  CONTENT_TYPE_JSON: "application/json",
  AUTHORIZATION: "Authorization",
} as const;

/**
 * Rating system configuration
 */
export const RATING_CONFIG = {
  MIN: 1,
  MAX: 10,
  STEP: 0.5,
} as const;

/**
 * Review count thresholds for display badges/stamps
 */
export const REVIEW_COUNT_THRESHOLDS = {
  ELITE: 1500,
  PROLIFIC: 500,
  REGULAR: 100,
  NEW: 1,
} as const;

/**
 * Component sizing constants
 * Centralize dimensions to keep UI consistent
 */
export const COMPONENT_SIZES = {
  // Album cards
  ALBUM_CARD_WIDTH: 175,
  ALBUM_CARD_HEIGHT: 175,

  // Review cards
  REVIEW_CARD_WIDTH: "500px",
  REVIEW_CARD_HEIGHT: "250px",
  REVIEW_CARD_IMAGE_WIDTH: "150px",
  REVIEW_CARD_IMAGE_HEIGHT: "150px",

  // Avatar sizes
  AVATAR_SMALL: "32px",
  AVATAR_MEDIUM: "48px",
  AVATAR_LARGE: "80px",
} as const;

/**
 * Pagination & limits
 */
export const PAGINATION = {
  ITEMS_PER_PAGE: 20,
  MAX_SEARCH_RESULTS: 100,
  ACTIVITY_FEED_LIMIT: 50,
} as const;

/**
 * Debounce timings (in milliseconds)
 */
export const DEBOUNCE_TIMES = {
  SEARCH: 300,
  INPUT: 500,
} as const;

/**
 * API request configuration
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 1,
  RETRY_DELAY: 1000, // 1 second
} as const;
