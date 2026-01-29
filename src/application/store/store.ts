import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import transactionsReducer from "./slices/transactionsSlice";
import deliveriesReducer from "./slices/deliveriesSlice";
import checkoutReducer from "./slices/checkoutSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    transactions: transactionsReducer,
    deliveries: deliveriesReducer,
    checkout: checkoutReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
