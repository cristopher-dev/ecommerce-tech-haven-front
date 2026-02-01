import deliveriesReducer, {
  setLoading,
  setError,
  setDeliveries,
  setCurrentDelivery,
  updateDeliveryStatus,
} from "@/application/store/slices/deliveriesSlice";
import type { DeliveryDTO } from "@/infrastructure/api/techHavenApiClient";

describe("deliveriesSlice", () => {
  const mockDelivery: DeliveryDTO = {
    id: "DEL001",
    orderId: "ORD001",
    status: "PENDING",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    estimatedDate: new Date().toISOString(),
    actualDate: null,
  };

  const mockDelivery2: DeliveryDTO = {
    id: "DEL002",
    orderId: "ORD002",
    status: "IN_TRANSIT",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    estimatedDate: new Date().toISOString(),
    actualDate: null,
  };

  const initialState = {
    items: [],
    currentDelivery: null,
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(deliveriesReducer(undefined, { type: "unknown" } as any)).toEqual(
      initialState,
    );
  });

  it("should set loading state to true", () => {
    const action = setLoading(true);
    const result = deliveriesReducer(initialState, action);

    expect(result.loading).toBe(true);
  });

  it("should set loading state to false", () => {
    const state = {
      items: [],
      currentDelivery: null,
      loading: true,
      error: null,
    };

    const action = setLoading(false);
    const result = deliveriesReducer(state, action);

    expect(result.loading).toBe(false);
  });

  it("should set error message", () => {
    const errorMessage = "Failed to fetch deliveries";
    const action = setError(errorMessage);
    const result = deliveriesReducer(initialState, action);

    expect(result.error).toBe(errorMessage);
  });

  it("should clear error by setting to null", () => {
    const state = {
      items: [],
      currentDelivery: null,
      loading: false,
      error: "Previous error",
    };

    const action = setError(null);
    const result = deliveriesReducer(state, action);

    expect(result.error).toBeNull();
  });

  it("should set deliveries and clear error", () => {
    const deliveries = [mockDelivery, mockDelivery2];
    const state = {
      items: [],
      currentDelivery: null,
      loading: false,
      error: "Previous error",
    };

    const action = setDeliveries(deliveries);
    const result = deliveriesReducer(state, action);

    expect(result.items).toHaveLength(2);
    expect(result.items).toEqual(deliveries);
    expect(result.error).toBeNull();
  });

  it("should replace existing deliveries", () => {
    const initialDeliveries = [mockDelivery];
    const newDeliveries = [mockDelivery2];
    const state = {
      items: initialDeliveries,
      currentDelivery: null,
      loading: false,
      error: null,
    };

    const action = setDeliveries(newDeliveries);
    const result = deliveriesReducer(state, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("DEL002");
  });

  it("should set current delivery", () => {
    const action = setCurrentDelivery(mockDelivery);
    const result = deliveriesReducer(initialState, action);

    expect(result.currentDelivery).toEqual(mockDelivery);
  });

  it("should clear current delivery by setting to null", () => {
    const state = {
      items: [],
      currentDelivery: mockDelivery,
      loading: false,
      error: null,
    };

    const action = setCurrentDelivery(null);
    const result = deliveriesReducer(state, action);

    expect(result.currentDelivery).toBeNull();
  });

  it("should update delivery status in items list", () => {
    const state = {
      items: [mockDelivery, mockDelivery2],
      currentDelivery: null,
      loading: false,
      error: null,
    };

    const action = updateDeliveryStatus({
      deliveryId: "DEL001",
      status: "DELIVERED",
    });
    const result = deliveriesReducer(state, action);

    expect(result.items[0].status).toBe("DELIVERED");
    expect(result.items[1].status).toBe("IN_TRANSIT");
  });

  it("should update delivery status in current delivery", () => {
    const state = {
      items: [],
      currentDelivery: mockDelivery,
      loading: false,
      error: null,
    };

    const action = updateDeliveryStatus({
      deliveryId: "DEL001",
      status: "IN_TRANSIT",
    });
    const result = deliveriesReducer(state, action);

    expect(result.currentDelivery?.status).toBe("IN_TRANSIT");
  });

  it("should update delivery status in both items and current delivery", () => {
    const state = {
      items: [mockDelivery, mockDelivery2],
      currentDelivery: mockDelivery,
      loading: false,
      error: null,
    };

    const action = updateDeliveryStatus({
      deliveryId: "DEL001",
      status: "DELIVERED",
    });
    const result = deliveriesReducer(state, action);

    expect(result.items[0].status).toBe("DELIVERED");
    expect(result.currentDelivery?.status).toBe("DELIVERED");
  });

  it("should handle empty deliveries list", () => {
    const action = setDeliveries([]);
    const result = deliveriesReducer(initialState, action);

    expect(result.items).toHaveLength(0);
    expect(result.error).toBeNull();
  });

  it("should not update non-existent delivery", () => {
    const state = {
      items: [mockDelivery],
      currentDelivery: null,
      loading: false,
      error: null,
    };

    const action = updateDeliveryStatus({
      deliveryId: "DEL999",
      status: "DELIVERED",
    });
    const result = deliveriesReducer(state, action);

    expect(result.items[0].status).toBe("PENDING");
  });
});
