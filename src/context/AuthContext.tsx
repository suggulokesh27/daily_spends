/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Role type
export type Role = "admin" | "user";

// 2️⃣ User type
export interface User {
  id: string;
  username: string;
  role: Role;
}

// 3️⃣ Auth Context type
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

// 4️⃣ Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 5️⃣ Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on client side
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 6️⃣ Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

// 7️⃣ Authorized component
interface AuthorizedProps {
  roles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function Authorized({ roles, children, fallback = null }: AuthorizedProps) {
  const { user } = useAuth();
  if (!user) return <>{fallback}</>;
  return roles.includes(user.role) ? <>{children}</> : <>{fallback}</>;
}
