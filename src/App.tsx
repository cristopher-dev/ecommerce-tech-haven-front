import { logout, restoreAuth } from '@/application/store/slices/authSlice';
import { RootState } from '@/application/store/store';
import CartProtectedRoute from '@/presentation/components/CartProtectedRoute';
import CheckoutProtectedRoute from '@/presentation/components/CheckoutProtectedRoute';
import ProtectedRoute from '@/presentation/components/ProtectedRoute';
import CartPage from '@/presentation/pages/CartPage';
import CheckoutDeliveryPage from '@/presentation/pages/CheckoutDeliveryPage';
import CheckoutFinalStatusPage from '@/presentation/pages/CheckoutFinalStatusPage';
import CheckoutSummaryPage from '@/presentation/pages/CheckoutSummaryPage';
import HomePage from '@/presentation/pages/HomePage';
import LoginPage from '@/presentation/pages/LoginPage';
import ProductPage from '@/presentation/pages/ProductPage';
import PurchasedItemsPage from '@/presentation/pages/PurchasedItemsPage';
import RegisterPage from '@/presentation/pages/RegisterPage';
import WishlistPage from '@/presentation/pages/WishlistPage';
import '@/styles/App.scss';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function AuthRestorer({ children }: { readonly children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(restoreAuth());
    }
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token && user) {
      dispatch(logout());
    }
  }, [user, dispatch]);

  return <>{children}</>;
}

function PublicPageGuard({ children }: { readonly children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
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
              <CartProtectedRoute>
                <CartPage />
              </CartProtectedRoute>
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
              <CheckoutProtectedRoute>
                <CheckoutDeliveryPage />
              </CheckoutProtectedRoute>
            }
          />
          <Route
            path="/checkout/delivery"
            element={
              <CheckoutProtectedRoute>
                <CheckoutDeliveryPage />
              </CheckoutProtectedRoute>
            }
          />
          <Route
            path="/checkout/summary"
            element={
              <CheckoutProtectedRoute>
                <CheckoutSummaryPage />
              </CheckoutProtectedRoute>
            }
          />
          <Route
            path="/checkout/final"
            element={
              <CheckoutProtectedRoute>
                <CheckoutFinalStatusPage />
              </CheckoutProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthRestorer>
  );
}

export default App;
