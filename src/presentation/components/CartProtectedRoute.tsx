import { useAppSelector } from "@/application/store/hooks";
import React from "react";
import { Navigate } from "react-router-dom";

interface CartProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * CartProtectedRoute component ensures that only authenticated users with
 * items in their cart can access the cart page. If the user is not authenticated
 * or their cart is empty, they are redirected appropriately.
 *
 * @example
 * <CartProtectedRoute>
 *   <CartPage />
 * </CartProtectedRoute>
 */
const CartProtectedRoute: React.FC<CartProtectedRouteProps> = ({
  children,
}) => {
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const cartItems = useAppSelector((state) => state.cart.items);

  // Redirect to login if not authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default CartProtectedRoute;
