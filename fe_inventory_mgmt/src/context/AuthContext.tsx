import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

export type UserRole = "admin" | "manager" | "user";

interface User {
  id: string;
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
    if (username && password) {
      // Mock user database with roles
      const mockUsers = [
        { username: "admin", password: "admin123", role: "admin" as UserRole },
        {
          username: "manager",
          password: "manager123",
          role: "manager" as UserRole,
        },
        { username: "viewer", password: "user123", role: "viewer" as UserRole },
      ];

      const foundUser = mockUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          username: foundUser.username,
          email: `${foundUser.username}@example.com`,
          role: foundUser.role,
        };

        setUser(newUser);
        localStorage.setItem("viewer", JSON.stringify(newUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
