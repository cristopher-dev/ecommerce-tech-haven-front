import { useAppSelector } from "@/application/store/hooks";
import React from "react";
import { Navigate } from "react-router-dom";

interface CheckoutProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * CheckoutProtectedRoute component ensures that only authenticated users with
 * items in their cart can access checkout routes. If the user is not authenticated
 * or their cart is empty, they are redirected appropriately.
 *
 * @example
 * <CheckoutProtectedRoute>
 *   <CheckoutDeliveryPage />
 * </CheckoutProtectedRoute>
 */
const CheckoutProtectedRoute: React.FC<CheckoutProtectedRouteProps> = ({
  children,
}) => {
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const cartItems = useAppSelector((state) => state.checkout.cartItems);

  // Redirect to login if not authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to cart if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return <>{children}</>;
};

export default CheckoutProtectedRoute;
