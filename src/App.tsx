import { logout, restoreAuth } from "@/application/store/slices/authSlice";
import { persistor, RootState, store } from "@/application/store/store";
import ProtectedRoute from "@/presentation/components/ProtectedRoute";
import CartPage from "@/presentation/pages/CartPage";
import CheckoutDeliveryPage from "@/presentation/pages/CheckoutDeliveryPage";
import CheckoutFinalStatusPage from "@/presentation/pages/CheckoutFinalStatusPage";
import CheckoutSummaryPage from "@/presentation/pages/CheckoutSummaryPage";
import HomePage from "@/presentation/pages/HomePage";
import LoginPage from "@/presentation/pages/LoginPage";
import ProductPage from "@/presentation/pages/ProductPage";
import PurchasedItemsPage from "@/presentation/pages/PurchasedItemsPage";
import RegisterPage from "@/presentation/pages/RegisterPage";
import WishlistPage from "@/presentation/pages/WishlistPage";
import "@/styles/App.scss";
import React, { useEffect, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

// Loading component shown while persisting
const PersistGateLoader = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh" }}
  >
    <p>Cargando...</p>
  </div>
);

// Component to restore auth on app load
function AuthRestorer({ children }: { readonly children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once on component mount
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(restoreAuth());
    }
  }, [dispatch]);

  // Check if there's a valid token (separate effect to avoid loop)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token && user) {
      // No token but user exists - this is invalid state, clear it
      dispatch(logout());
    }
  }, [user, dispatch]);

  return <>{children}</>;
}

// Component to check if user is authenticated and redirect to login if not
function PublicPageGuard({ children }: { readonly children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);

  // Si no hay usuario, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<PersistGateLoader />} persistor={persistor}>
        <AuthRestorer>
          <Router>
            <Routes>
              {/* Public Routes (accessible without auth) */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Public Routes (require auth but show public content) */}
              <Route
                path="/"
                element={
                  <PublicPageGuard>
                    <HomePage />
                  </PublicPageGuard>
                }
              />
              <Route
                path="/product"
                element={
                  <PublicPageGuard>
                    <ProductPage />
                  </PublicPageGuard>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/purchases"
                element={
                  <ProtectedRoute>
                    <PurchasedItemsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutDeliveryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/delivery"
                element={
                  <ProtectedRoute>
                    <CheckoutDeliveryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/summary"
                element={
                  <ProtectedRoute>
                    <CheckoutSummaryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/final"
                element={
                  <ProtectedRoute>
                    <CheckoutFinalStatusPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthRestorer>
      </PersistGate>
    </Provider>
  );
}

export default App;
