/**
 * API-specific types and enums
 * Separates backend API contracts from frontend domain models
 */

/**
 * Activity filter types - used in activity endpoints
 */
export enum ActivityFilterType {
  INCOMING = "incoming",
  FRIENDS = "friends",
  YOU = "you",
}

export const ACTIVITY_FILTER_LABELS: Record<ActivityFilterType, string> = {
  [ActivityFilterType.INCOMING]: "Following",
  [ActivityFilterType.FRIENDS]: "Friends",
  [ActivityFilterType.YOU]: "You",
};

/**
 * Standard API error response from backend
 */
export interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * HTTP methods
 */
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

/**
 * HTTP status codes commonly used in the app
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}
