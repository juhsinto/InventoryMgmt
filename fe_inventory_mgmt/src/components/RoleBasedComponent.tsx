import React, { ReactNode } from "react";
import { useAuth, UserRole } from "../context/AuthContext";

interface RoleBasedComponentProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { hasRole } = useAuth();

  if (hasRole(allowedRoles)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default RoleBasedComponent;
