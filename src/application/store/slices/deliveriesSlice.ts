import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DeliveryDTO } from "@/infrastructure/api/techHavenApiClient";

interface DeliveriesState {
  items: DeliveryDTO[];
  currentDelivery: DeliveryDTO | null;
  loading: boolean;
  error: string | null;
}

const initialState: DeliveriesState = {
  items: [],
  currentDelivery: null,
  loading: false,
  error: null,
};

export const deliveriesSlice = createSlice({
  name: "deliveries",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDeliveries: (state, action: PayloadAction<DeliveryDTO[]>) => {
      state.items = action.payload;
      state.error = null;
    },
    setCurrentDelivery: (state, action: PayloadAction<DeliveryDTO | null>) => {
      state.currentDelivery = action.payload;
    },
    updateDeliveryStatus: (
      state,
      action: PayloadAction<{
        deliveryId: string;
        status: "PENDING" | "IN_TRANSIT" | "DELIVERED";
      }>,
    ) => {
      const delivery = state.items.find(
        (d) => d.id === action.payload.deliveryId,
      );
      if (delivery) {
        delivery.status = action.payload.status;
      }
      if (state.currentDelivery?.id === action.payload.deliveryId) {
        state.currentDelivery.status = action.payload.status;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setDeliveries,
  setCurrentDelivery,
  updateDeliveryStatus,
} = deliveriesSlice.actions;

export default deliveriesSlice.reducer;
