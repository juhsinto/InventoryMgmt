import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useLayoutEffect,
} from "react";
import api from "../utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";
import { jwtDecode } from "jwt-decode";
import axios, { AxiosError } from "axios";

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
  const token = localStorage.getItem(ACCESS_TOKEN);

  useLayoutEffect(() => {
    const authInterceptor = // Add a request interceptor
      api.interceptors.request.use(
        (config) => {
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    // borrowed logic from https://blog.theashishmaurya.me/handling-jwt-access-and-refresh-token-using-axios-in-react-app
    // and some brilliance from https://www.youtube.com/watch?v=AcYF18oGn6Y
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 401) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            const response = await api.post("/api/token/refresh/", {
              refresh: refreshToken,
            });
            const newToken = response.data.access;
            localStorage.setItem(ACCESS_TOKEN, newToken);

            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (error) {
            // Handle refresh token error or redirect to login
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  });

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await api.post("/api/token/", { username, password });
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
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
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
