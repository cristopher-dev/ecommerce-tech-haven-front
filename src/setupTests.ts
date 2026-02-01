/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/// <reference types="jest" />
import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "util";

declare global {
  var TextEncoder: any;
  var TextDecoder: any;
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
