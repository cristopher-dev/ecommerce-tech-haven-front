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
 * @example
 * <ProtectedRoute>
 *   <CheckoutDeliveryPage />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
