import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";
import type { AuthContextType, User } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get<User>("/auth/profile");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<User>("/auth/login", { email, password });
    setUser(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post<User>("/auth/register", {
      name,
      email,
      password,
    });
    setUser(data);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get<User>("/auth/profile");
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
