/**
 * Get API Base URL - works with both Vite and Jest
 * Avoids import.meta entirely to work with Jest coverage instrumentation
 */

let cachedUrl: string | null = null;

export const getApiBaseUrl = (): string => {
  // Return cached value if available
  if (cachedUrl) {
    return cachedUrl;
  }

  // Try process.env first (Jest environment)
  if (typeof process !== 'undefined' && process.env?.VITE_TECH_HAVEN_API_URL) {
    cachedUrl = process.env.VITE_TECH_HAVEN_API_URL;
    return cachedUrl;
  }

  // Fallback to globalThis for any environment
  const globalEnv = (globalThis as any).process?.env;
  if (globalEnv?.VITE_TECH_HAVEN_API_URL) {
    cachedUrl = globalEnv.VITE_TECH_HAVEN_API_URL;
    return cachedUrl;
  }

  // Default fallback
  cachedUrl = 'http://localhost:3000/api';
  return cachedUrl;
};
