/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
import "@testing-library/jest-dom";

// Polyfills for jsdom
import { TextEncoder, TextDecoder } from "util";

declare global {
  var TextEncoder: any;
  var TextDecoder: any;
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
