/**
 * API Interceptor for Tech Haven
 * Automatically adds JWT token to all authenticated requests
 */

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

/**
 * Interceptor function to add authorization header to requests
 * @param options Fetch options
 * @returns Enhanced options with Authorization header
 */
export function withAuthInterceptor(
  options: Record<string, unknown> = {},
): Record<string, unknown> {
  const token = getAuthToken();

  if (!token) {
    return options;
  }

  const headers = (
    typeof options.headers === "object" ? options.headers : {}
  ) as Record<string, string>;

  return {
    ...options,
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };
}
