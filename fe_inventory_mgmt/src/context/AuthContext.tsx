import axios from "axios";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";

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

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // TODO: use OAuth to login
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // [user] doejohn ; password123 && [manager] testmanager ; fatcat32 && [admin] root ; fatcat32
    const response = await axios.post("http://127.0.0.1:8000/api/token/", {
      username,
      password,
    });
    if (response.status === 200) {
      const { access } = response.data;

      // store the token and then use it to get the user data
      const user = jwtDecode(access) as User;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", access);
      return true;
    }

    return false;
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
