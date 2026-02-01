/**
 * Get API Base URL - works with both Vite and Jest
 */

export const getApiBaseUrl = (): string => {
  try {
    const env = import.meta.env as { VITE_TECH_HAVEN_API_URL?: string };
    if (env.VITE_TECH_HAVEN_API_URL) {
      return env.VITE_TECH_HAVEN_API_URL;
    }
  } catch {
  }

  const globalEnv = (globalThis as any).process?.env;
  if (globalEnv?.VITE_TECH_HAVEN_API_URL) {
    return globalEnv.VITE_TECH_HAVEN_API_URL;
  }

  return "http://localhost:3000/api";
};
