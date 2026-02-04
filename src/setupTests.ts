/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/// <reference types="jest" />
import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "node:util";
import i18n from "@/i18n/config";

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
