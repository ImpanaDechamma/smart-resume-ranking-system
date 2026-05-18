"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  role: "hr" | "candidate";
  name: string;
}

interface AuthContextType {
  user: User | null;
  justRegistered: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: "hr" | "candidate") => Promise<boolean>;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [justRegistered, setJustRegistered] = useState(false);

  // Initialize from localStorage on mount (optional enhancement, skipping for brevity but basic version provided)
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const userData: User = { id: data.id || "", email: data.email, role: data.role, name: data.name };
        setUser(userData);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setJustRegistered(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: "hr" | "candidate"
  ): Promise<boolean> => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });
      if (res.ok) {
        const data = await res.json();
        const userData: User = { id: data.id || "", email: data.email, role: data.role, name: data.name };
        setUser(userData);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setJustRegistered(role === "candidate");
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setJustRegistered(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const completeOnboarding = () => {
    setJustRegistered(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, justRegistered, login, register, logout, completeOnboarding }}
    >
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
