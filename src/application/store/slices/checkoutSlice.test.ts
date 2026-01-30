import checkoutReducer, {
  setStep,
  setDeliveryData,
  setPaymentData,
  resetCheckout,
} from "./checkoutSlice";

describe("checkoutSlice", () => {
  const initialState = {
    step: 1,
    deliveryData: null,
    paymentData: null,
  };

  it("should return the initial state", () => {
    expect(checkoutReducer(undefined, { type: "unknown" })).toEqual(
      initialState,
    );
  });

  it("should handle setStep", () => {
    const actual = checkoutReducer(initialState, setStep(2));
    expect(actual.step).toBe(2);
  });

  it("should handle setDeliveryData", () => {
    const deliveryData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "3001234567",
      address: "123 Main St",
      city: "Bogotá",
    };
    const actual = checkoutReducer(initialState, setDeliveryData(deliveryData));
    expect(actual.deliveryData).toEqual(deliveryData);
  });

  it("should handle setPaymentData", () => {
    const paymentData = {
      cardNumber: "4111111111111111",
      cardHolder: "John Doe",
      expiryDate: "12/25",
      cvv: "123",
    };
    const actual = checkoutReducer(initialState, setPaymentData(paymentData));
    expect(actual.paymentData).toEqual(paymentData);
  });

  it("should handle resetCheckout", () => {
    const stateWithData = {
      step: 3,
      deliveryData: { firstName: "John" },
      paymentData: { cardNumber: "4111" },
    };
    const actual = checkoutReducer(stateWithData, resetCheckout());
    expect(actual).toEqual(initialState);
  });

  it("should preserve other state when setting step", () => {
    const stateWithData = {
      step: 1,
      deliveryData: { firstName: "John" },
      paymentData: null,
    };
    const actual = checkoutReducer(stateWithData, setStep(2));
    expect(actual.deliveryData).toEqual(stateWithData.deliveryData);
    expect(actual.step).toBe(2);
  });
});
