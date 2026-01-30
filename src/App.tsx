import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/application/store/store";
import { restoreAuth, logout } from "@/application/store/slices/authSlice";
import { RootState } from "@/application/store/store";
import HomePage from "@/presentation/pages/HomePage";
import ProductPage from "@/presentation/pages/ProductPage";
import CartPage from "@/presentation/pages/CartPage";
import WishlistPage from "@/presentation/pages/WishlistPage";
import PurchasedItemsPage from "@/presentation/pages/PurchasedItemsPage";
import CheckoutDeliveryPage from "@/presentation/pages/CheckoutDeliveryPage";
import CheckoutSummaryPage from "@/presentation/pages/CheckoutSummaryPage";
import CheckoutFinalStatusPage from "@/presentation/pages/CheckoutFinalStatusPage";
import RegisterPage from "@/presentation/pages/RegisterPage";
import LoginPage from "@/presentation/pages/LoginPage";
import ProtectedRoute from "@/presentation/components/ProtectedRoute";
import "@/styles/App.scss";

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
function AuthRestorer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(restoreAuth());

    // Check if there's a valid token
    const token = localStorage.getItem("authToken");
    if (!token && user) {
      // No token but user exists - this is invalid state, clear it
      dispatch(logout());
    }
  }, [dispatch, user]);

  return <>{children}</>;
}

// Component to check if user is authenticated and redirect to login if not
function PublicPageGuard({ children }: { children: React.ReactNode }) {
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
