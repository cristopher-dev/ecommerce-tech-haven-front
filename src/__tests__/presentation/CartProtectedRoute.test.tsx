import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import CartProtectedRoute from "@/presentation/components/CartProtectedRoute";
import authSlice from "@/application/store/slices/authSlice";
import cartSlice from "@/application/store/slices/cartSlice";
import checkoutSlice from "@/application/store/slices/checkoutSlice";
import deliveriesSlice from "@/application/store/slices/deliveriesSlice";
import productsSlice from "@/application/store/slices/productsSlice";
import purchasedItemsSlice from "@/application/store/slices/purchasedItemsSlice";
import transactionsSlice from "@/application/store/slices/transactionsSlice";
import wishlistSlice from "@/application/store/slices/wishlistSlice";
import { UserProfile } from "@/domain/entities/User";

describe("CartProtectedRoute", () => {
  const mockUser: UserProfile = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    createdAt: new Date().toISOString(),
    role: "user",
    isActive: true,
  };

  const mockCartItem = {
    id: "1",
    product: {
      id: 1,
      name: "Test Product",
      price: 10000,
      rating: 4.5,
      description: "Test",
      image: "test.jpg",
    },
    quantity: 1,
  };

  const createStore = (authenticated = false, hasCartItems = false) => {
    return configureStore({
      reducer: {
        auth: authSlice,
        cart: cartSlice,
        checkout: checkoutSlice,
        deliveries: deliveriesSlice,
        products: productsSlice,
        purchasedItems: purchasedItemsSlice,
        transactions: transactionsSlice,
        wishlist: wishlistSlice,
      },
      preloadedState: {
        auth: authenticated
          ? {
              user: mockUser,
              token: "test-token",
              isLoading: false,
              error: null,
              isAuthenticated: true,
            }
          : {
              user: null,
              token: null,
              isLoading: false,
              error: null,
              isAuthenticated: false,
            },
        cart: {
          items: hasCartItems ? [mockCartItem] : [],
          loading: false,
          error: null,
        },
        checkout: { cartItems: [], paymentData: null, deliveryData: null, baseFee: 5000, deliveryFee: 10000, loading: false, error: null, step: "product", lastTransactionId: null, transactionItems: [], token: null },
        deliveries: { items: [], loading: false, error: null },
        products: { items: [], loading: false, error: null },
        purchasedItems: { items: [], totalPurchases: 0, loading: false, error: null },
        transactions: { items: [], loading: false, error: null },
        wishlist: { items: [], loading: false, error: null },
      },
    });
  };

  it("renders children when authenticated and cart has items", () => {
    const store = createStore(true, true);
    const { container } = render(
      <Provider store={store}>
        <Router>
          <CartProtectedRoute>
            <div>Cart Content</div>
          </CartProtectedRoute>
        </Router>
      </Provider>
    );

    expect(container.textContent).toContain("Cart Content");
  });

  it("navigates to login when not authenticated", () => {
    const store = createStore(false, false);
    render(
      <Provider store={store}>
        <Router>
          <CartProtectedRoute>
            <div>Cart Content</div>
          </CartProtectedRoute>
        </Router>
      </Provider>
    );
  });

  it("navigates to home when cart is empty", () => {
    const store = createStore(true, false);
    render(
      <Provider store={store}>
        <Router>
          <CartProtectedRoute>
            <div>Cart Content</div>
          </CartProtectedRoute>
        </Router>
      </Provider>
    );
  });
});
