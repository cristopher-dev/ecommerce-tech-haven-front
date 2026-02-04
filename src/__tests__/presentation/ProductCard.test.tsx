import { render, screen } from "@testing-library/react";
import ProductCard from "@/presentation/components/ProductCard";
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

describe("ProductCard Component", () => {
  const mockProduct = {
    id: "1",
    name: "Test Product",
    description: "A test product",
    price: 99.99,
    category: "electronics",
    stock: 10,
    rating: 4.5,
    image: "https://example.com/image.jpg",
  };

  it("should render product card", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>,
    );
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("should display product price", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>,
    );
    expect(screen.getByText(/99.99|99,99/)).toBeInTheDocument();
  });
});
