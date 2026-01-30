/**
 * Get API Base URL - works with both Vite and Jest
 */

export const getApiBaseUrl = (): string => {
  // In test environment (Jest), use process.env
  if (typeof process !== "undefined" && process.env.VITE_TECH_HAVEN_API_URL) {
    return process.env.VITE_TECH_HAVEN_API_URL;
  }

  // In browser environment (Vite), import.meta will be available
  // But we use process.env as fallback since both work in Vite
  const url =
    (typeof process !== "undefined" && process.env.VITE_TECH_HAVEN_API_URL) ||
    "http://localhost:3001/api";

  return url;
};
