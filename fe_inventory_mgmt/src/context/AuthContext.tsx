import React, { createContext, useState, useContext, ReactNode } from "react";
import api from "../utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";
import { jwtDecode } from "jwt-decode";
import { AxiosError } from "axios";

export type UserRole = "admin" | "manager" | "user";

interface User {
  user_id: string;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  // signInError: string;
  hasRole: (roles: UserRole[]) => boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // const [signInError, setSignInError] = useState<string>("");

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await api.post("/api/token/", { username, password });
      console.log("res", res);
      if (res.status !== 200) {
        console.log("res", res);
        // throw new Error("Invalid credentials " + res.data.detail);
      }
      const user = jwtDecode(res.data.access) as User;
      setUser(user);
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      return true;
    } catch (error) {
      console.log("Encountered an error while trying to login");
      let errorMessage = "Invalid credentials";

      if (error instanceof AxiosError && error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  // Helper function to check if user has one of the required roles
  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        userRole: user?.role || null,
        hasRole,
        // signInError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
