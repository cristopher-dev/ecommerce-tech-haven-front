/* eslint-disable @typescript-eslint/no-explicit-any */

/// <reference types="jest" />
import '@testing-library/jest-dom';

import { TextDecoder, TextEncoder } from 'node:util';
import i18n from '@/i18n/config';

declare global {
  var TextEncoder: any;
  var TextDecoder: any;
}

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder as any;

// Initialize i18n for tests
if (!i18n.isInitialized) {
  i18n.init({});
}

// Mock import.meta.env for Jest environment
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_DEMO_EMAIL: 'admin@techhaven.com',
        VITE_DEMO_PASSWORD: 'admin123',
      },
    },
  },
  writable: true,
  configurable: true,
});
