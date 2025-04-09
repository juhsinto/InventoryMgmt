import React, { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/user";

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
