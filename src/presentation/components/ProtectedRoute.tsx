import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/application/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component ensures that only authenticated users can access
 * certain routes. If the user is not authenticated, they are redirected to the login page.
 * This component waits for Redux state to be fully hydrated before rendering.
 *
 * @example
 * <ProtectedRoute>
 *   <CheckoutDeliveryPage />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // While still loading from localStorage, show nothing to prevent flash of content
  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
