"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import { User } from "@/types/user"; // Corrected path

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch user");
      setUser(null);

      // Define public paths that do not require authentication
      const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
      const currentPath = window.location.pathname;

      // Only redirect if the user is not on a public path
      if (!publicPaths.includes(currentPath)) {
        // Using router.push is generally better than window.location.href for client-side navigation
        // but since this is a hard redirect on auth failure, window.location is acceptable.
        window.location.href = "/login";
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post("/users/login", { email, password });
      await fetchUser(); // Fetch user data after successful login
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      setUser(null);
      setIsLoading(false); // Make sure we reset loading state on error
      throw err; // Re-throw to handle in the form component
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await api.post("/users/logout");
      setUser(null);
      if(window.location.pathname !== '/login'){
        window.location.href = '/login';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
