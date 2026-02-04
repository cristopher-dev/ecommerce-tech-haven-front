import { render } from "@testing-library/react";
import ProductSection from "@/presentation/components/ProductSection";
import { Provider } from "react-redux";
import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import authReducer from "@/application/store/slices/authSlice";
import cartReducer from "@/application/store/slices/cartSlice";
import wishlistReducer from "@/application/store/slices/wishlistSlice";
import productsReducer from "@/application/store/slices/productsSlice";
import { BrowserRouter } from "react-router-dom";
import { RootState } from "@/application/store/store";
import checkoutReducer from "@/application/store/slices/checkoutSlice";
import deliveriesReducer from "@/application/store/slices/deliveriesSlice";
import transactionsReducer from "@/application/store/slices/transactionsSlice";
import purchasedItemsReducer from "@/application/store/slices/purchasedItemsSlice";

const createMockStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      products: productsReducer,
      checkout: checkoutReducer,
      deliveries: deliveriesReducer,
      transactions: transactionsReducer,
      purchasedItems: purchasedItemsReducer,
    },
    preloadedState,
  });
};

describe("ProductSection Component", () => {
  it("should render without crashing", () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductSection title="Test" />
        </BrowserRouter>
      </Provider>,
    );
    expect(container).toBeInTheDocument();
  });
});
