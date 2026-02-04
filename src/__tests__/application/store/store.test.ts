import { store } from "@/application/store/store";

describe("Redux Store", () => {
  it("should be defined", () => {
    expect(store).toBeDefined();
  });

  it("should have initial state", () => {
    const state = store.getState();
    expect(state).toBeDefined();
  });

  it("should have auth slice in state", () => {
    const state = store.getState();
    expect(state.auth).toBeDefined();
  });

  it("should have cart slice in state", () => {
    const state = store.getState();
    expect(state.cart).toBeDefined();
  });

  it("should have all required slices", () => {
    const state = store.getState();
    const requiredSlices = [
      "auth",
      "cart",
      "checkout",
      "deliveries",
      "products",
      "purchasedItems",
      "transactions",
      "wishlist",
    ];
    requiredSlices.forEach((slice) => {
      expect(state).toHaveProperty(slice);
    });
  });
});
