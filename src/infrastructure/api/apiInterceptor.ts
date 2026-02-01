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
 * Automatically adds JWT token if available, for all endpoints
 * @param options Fetch options
 * @param endpoint The API endpoint being called
 * @returns Enhanced options with Authorization header (if token available)
 */
export function withAuthInterceptor(
  options: Record<string, unknown> = {},
  endpoint: string = "",
): Record<string, unknown> {
  const token = getAuthToken();

  const authOnlyEndpoints = ["/auth/login", "/auth/register"];
  const isAuthOnlyEndpoint = authOnlyEndpoints.some((ep) =>
    endpoint.includes(ep),
  );

  if (!token) {
    return options;
  }

  if (isAuthOnlyEndpoint) {
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
