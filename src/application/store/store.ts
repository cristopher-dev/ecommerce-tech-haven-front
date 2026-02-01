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

const createSafeStorage = () => {
  try {
    const test = "__localStorage_test__";
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
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
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["auth.user.createdAt"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
