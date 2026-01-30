/**
 * Get API Base URL - works with both Vite and Jest
 */

export const getApiBaseUrl = (): string => {
  // In browser environment (Vite), use import.meta.env
  if (import.meta.env.VITE_TECH_HAVEN_API_URL) {
    return import.meta.env.VITE_TECH_HAVEN_API_URL;
  }

  // In test environment (Jest), use process.env
  if (typeof process !== "undefined" && process.env.VITE_TECH_HAVEN_API_URL) {
    return process.env.VITE_TECH_HAVEN_API_URL;
  }

  // Default fallback
  return "http://localhost:3000/api";
};
