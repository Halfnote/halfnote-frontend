/**
 * Centralized API error handling
 * Provides consistent error formatting and user-friendly error messages
 */

import { ApiErrorResponse } from "../types/api";

/**
 * Parses various error response formats from the API
 * The backend might return errors in different structures
 */
export const parseApiError = (error: unknown): string => {
  // If it's already a string, return it
  if (typeof error === "string") {
    return error;
  }

  // If it's an Error object
  if (error instanceof Error) {
    return error.message;
  }

  // If it's an API error response object
  if (typeof error === "object" && error !== null) {
    const apiError = error as ApiErrorResponse;
    return (
      apiError.message ||
      apiError.detail ||
      apiError.error ||
      "An unexpected error occurred"
    );
  }

  // Fallback
  return "An unexpected error occurred";
};

/**
 * Formats API errors with context for the user
 * Example: "Failed to create review: Invalid rating"
 */
export const formatApiError = (
  error: unknown,
  context: string
): string => {
  const message = parseApiError(error);
  return `${context}: ${message}`;
};

/**
 * User-friendly error messages for common scenarios
 * Maps specific errors to helpful messages
 */
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  const message = parseApiError(error);

  // Map common error messages to user-friendly versions
  const errorMap: Record<string, string> = {
    "user already exists": "This username is already taken",
    "invalid credentials": "Username or password is incorrect",
    "not found": "This item was not found. It may have been deleted.",
    "permission denied": "You don't have permission to do this",
    "network error": "Network connection error. Please check your connection.",
  };

  // Check if the error message contains any known error patterns
  const lowerMessage = message.toLowerCase();
  for (const [pattern, friendlyMsg] of Object.entries(errorMap)) {
    if (lowerMessage.includes(pattern)) {
      return friendlyMsg;
    }
  }

  // If no match, return original message
  return message;
};

/**
 * Logs errors in development, suppresses in production
 */
export const logError = (
  context: string,
  error: unknown,
  includeStack = false
): void => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}]`, error);
    if (includeStack && error instanceof Error) {
      console.error(error.stack);
    }
  }
};

/**
 * Checks if error is a specific type (for conditional handling)
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.toLowerCase().includes("network") ||
      error.message.toLowerCase().includes("fetch")
    );
  }
  return false;
};

export const isAuthError = (error: unknown): boolean => {
  const message = parseApiError(error);
  return (
    message.toLowerCase().includes("unauthorized") ||
    message.toLowerCase().includes("invalid token") ||
    message.toLowerCase().includes("not authenticated")
  );
};
