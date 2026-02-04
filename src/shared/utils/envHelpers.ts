/**
 * Environment variable helper
 * Provides fallback values for environment variables
 */

// Default values
const DEFAULT_DEMO_EMAIL = 'admin@techhaven.com';
const DEFAULT_DEMO_PASSWORD = 'admin123';

declare global {
  interface ImportMeta {
    env?: {
      VITE_DEMO_EMAIL?: string;
      VITE_DEMO_PASSWORD?: string;
    };
  }
}

// Cache for environment variables
let cachedDemoEmail: string | null = null;
let cachedDemoPassword: string | null = null;

export function getDemoEmail(): string {
  if (cachedDemoEmail !== null) {
    return cachedDemoEmail;
  }

  // In production, this will be replaced by Vite during build
  // In tests, we return the default
  cachedDemoEmail = DEFAULT_DEMO_EMAIL;
  return DEFAULT_DEMO_EMAIL;
}

export function getDemoPassword(): string {
  if (cachedDemoPassword !== null) {
    return cachedDemoPassword;
  }

  // In production, this will be replaced by Vite during build
  // In tests, we return the default
  cachedDemoPassword = DEFAULT_DEMO_PASSWORD;
  return DEFAULT_DEMO_PASSWORD;
}
