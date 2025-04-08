import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, hasRole } = useAuth();

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  // If roles are specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = hasRole(allowedRoles);

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
