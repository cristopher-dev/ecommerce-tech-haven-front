import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/application/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component ensures that only authenticated users can access
 * certain routes. If the user is not authenticated, they are redirected to the login page.
 *
 * Checks if there's a valid token in Redux state (which is persisted from localStorage).
 * If no token exists, redirects to /login.
 *
 * @example
 * <ProtectedRoute>
 *   <CheckoutDeliveryPage />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
