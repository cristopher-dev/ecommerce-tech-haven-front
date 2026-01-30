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
 * Excludes auth header for public endpoints like /auth/login and /auth/register
 * @param options Fetch options
 * @param endpoint The API endpoint being called
 * @returns Enhanced options with Authorization header (if applicable)
 */
export function withAuthInterceptor(
  options: Record<string, unknown> = {},
  endpoint: string = "",
): Record<string, unknown> {
  const token = getAuthToken();

  // Skip Authorization header for public auth endpoints
  const publicEndpoints = ["/auth/login", "/auth/register"];
  const isPublicEndpoint = publicEndpoints.some((ep) => endpoint.includes(ep));

  if (!token || isPublicEndpoint) {
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
