import { getApiBaseUrl } from "@/infrastructure/getApiBaseUrl";

describe("getApiBaseUrl", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.VITE_TECH_HAVEN_API_URL;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.VITE_TECH_HAVEN_API_URL = originalEnv;
    } else {
      delete process.env.VITE_TECH_HAVEN_API_URL;
    }
  });

  it("should return default API URL when no env variable is set", () => {
    delete process.env.VITE_TECH_HAVEN_API_URL;
    const url = getApiBaseUrl();
    expect(url).toBe("http://localhost:3001/api");
  });

  it("should return environment variable URL when set", () => {
    process.env.VITE_TECH_HAVEN_API_URL = "http://custom-api.com/api";
    const url = getApiBaseUrl();
    expect(url).toBe("http://custom-api.com/api");
  });

  it("should handle production API URL from environment", () => {
    process.env.VITE_TECH_HAVEN_API_URL = "https://api.techhaven.com/api";
    const url = getApiBaseUrl();
    expect(url).toBe("https://api.techhaven.com/api");
  });

  it("should return a non-empty string", () => {
    delete process.env.VITE_TECH_HAVEN_API_URL;
    const url = getApiBaseUrl();
    expect(typeof url).toBe("string");
    expect(url.length).toBeGreaterThan(0);
  });

  it("should return a valid URL", () => {
    delete process.env.VITE_TECH_HAVEN_API_URL;
    const url = getApiBaseUrl();
    expect(url).toMatch(/^http/);
  });

  it("should be consistent across multiple calls", () => {
    delete process.env.VITE_TECH_HAVEN_API_URL;
    const url1 = getApiBaseUrl();
    const url2 = getApiBaseUrl();
    expect(url1).toBe(url2);
  });

  it("should include /api endpoint", () => {
    delete process.env.VITE_TECH_HAVEN_API_URL;
    const url = getApiBaseUrl();
    expect(url).toContain("api");
  });

  it("should have proper protocol", () => {
    delete process.env.VITE_TECH_HAVEN_API_URL;
    const url = getApiBaseUrl();
    expect(url.includes("http")).toBe(true);
  });

  it("should support localhost development URL", () => {
    delete process.env.VITE_TECH_HAVEN_API_URL;
    const url = getApiBaseUrl();
    expect(url.length).toBeGreaterThan(0);
  });

  it("should handle empty string fallback", () => {
    process.env.VITE_TECH_HAVEN_API_URL = "";
    const url = getApiBaseUrl();
    expect(url.length).toBeGreaterThan(0);
  });
});
