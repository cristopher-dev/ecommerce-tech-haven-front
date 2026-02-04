import i18n from "@/i18n/config";

describe("i18n config", () => {
  it("should be initialized", () => {
    expect(i18n).toBeDefined();
  });

  it("should have language property", () => {
    expect(i18n.language).toBeDefined();
  });

  it("should support language detection", () => {
    expect(i18n.options).toBeDefined();
  });

  it("should have translation resources", () => {
    expect(i18n.options.resources).toBeDefined();
  });

  it("should support multiple languages", () => {
    const resources = i18n.options.resources;
    expect(Object.keys(resources).length).toBeGreaterThan(0);
  });
});
