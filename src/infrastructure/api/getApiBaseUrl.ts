/**
 * Get API Base URL - works with both Vite and Jest
 */

export const getApiBaseUrl = (): string => {
  // In test environment (Jest), use process.env
  if (typeof process !== "undefined" && process.env.VITE_TECH_HAVEN_API_URL) {
    return process.env.VITE_TECH_HAVEN_API_URL;
  }

  // In browser environment (Vite), use import.meta.env
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = (import as any).meta;
    if (meta?.env?.VITE_TECH_HAVEN_API_URL) {
      return meta.env.VITE_TECH_HAVEN_API_URL;
    }
  } catch {
    // Ignore errors from import.meta in non-module environments
  }

  // Default fallback
  return "http://localhost:3000/api";
};

