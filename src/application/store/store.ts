import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import productsReducer from "./slices/productsSlice";
import transactionsReducer from "./slices/transactionsSlice";
import deliveriesReducer from "./slices/deliveriesSlice";
import checkoutReducer from "./slices/checkoutSlice";
import wishlistReducer from "./slices/wishlistSlice";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import purchasedItemsReducer from "./slices/purchasedItemsSlice";

// Create a safe storage adapter that returns Promises (required by redux-persist v6+)
const createSafeStorage = () => {
  // Check if localStorage is available
  try {
    const test = "__localStorage_test__";
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      // Wrap localStorage to return Promises
      return {
        getItem: (key: string) =>
          Promise.resolve(window.localStorage.getItem(key)),
        setItem: (key: string, value: string) =>
          Promise.resolve(window.localStorage.setItem(key, value)),
        removeItem: (key: string) =>
          Promise.resolve(window.localStorage.removeItem(key)),
        clear: () => Promise.resolve(window.localStorage.clear()),
      };
    }
  } catch (e) {
    console.warn("localStorage is not available, using memory storage");
  }

  // Fallback to memory storage with Promise support
  const memoryStorage: Record<string, string> = {};
  return {
    getItem: (key: string) => Promise.resolve(memoryStorage[key] || null),
    setItem: (key: string, value: string) =>
      Promise.resolve((memoryStorage[key] = value)),
    removeItem: (key: string) => Promise.resolve(delete memoryStorage[key]),
    clear: () =>
      Promise.resolve(
        Object.keys(memoryStorage).forEach((key) => delete memoryStorage[key]),
      ),
  };
};

const storage = createSafeStorage();

// Create individual persist configs for slices that need persistence
const checkoutPersistConfig = {
  key: "checkout",
  storage,
};

const cartPersistConfig = {
  key: "cart",
  storage,
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage,
};

const purchasedItemsPersistConfig = {
  key: "purchasedItems",
  storage,
};

// Apply persistence to individual reducers
const persistedCheckoutReducer = persistReducer(
  checkoutPersistConfig,
  checkoutReducer,
);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(
  wishlistPersistConfig,
  wishlistReducer,
);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedPurchasedItemsReducer = persistReducer(
  purchasedItemsPersistConfig,
  purchasedItemsReducer,
);

// Combine all reducers
const rootReducer = {
  products: productsReducer,
  transactions: transactionsReducer,
  deliveries: deliveriesReducer,
  checkout: persistedCheckoutReducer,
  wishlist: persistedWishlistReducer,
  cart: persistedCartReducer,
  auth: persistedAuthReducer,
  purchasedItems: persistedPurchasedItemsReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        // Ignore these paths that may contain Date objects
        ignoredPaths: ["auth.user.createdAt"],
      },
    }),
});

// Create persistor from store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
