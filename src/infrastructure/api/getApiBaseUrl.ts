/**
 * Get API Base URL - works with both Vite and Jest
 */

export const getApiBaseUrl = (): string => {
  // In browser environment (Vite), use import.meta.env
  try {
    const env = import.meta.env as { VITE_TECH_HAVEN_API_URL?: string };
    if (env.VITE_TECH_HAVEN_API_URL) {
      return env.VITE_TECH_HAVEN_API_URL;
    }
  } catch {
    // Ignore errors from import.meta in non-module environments
  }

  // In test environment (Jest), use process.env via globalThis
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalEnv = (globalThis as any).process?.env;
  if (globalEnv?.VITE_TECH_HAVEN_API_URL) {
    return globalEnv.VITE_TECH_HAVEN_API_URL;
  }

  // Default fallback
  return "http://localhost:3000/api";
};
