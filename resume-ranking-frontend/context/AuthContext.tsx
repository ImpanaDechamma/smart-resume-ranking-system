"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  role: "hr" | "candidate";
  name: string;
}

interface AuthContextType {
  user: User | null;
  justRegistered: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string, role: "hr" | "candidate") => boolean;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoAccounts = [
  { email: "hr@company.com", password: "hr123", name: "Sarah Johnson", role: "hr" as const },
  { email: "candidate@email.com", password: "cand123", name: "John Smith", role: "candidate" as const },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [justRegistered, setJustRegistered] = useState(false);

  const login = (email: string, password: string): boolean => {
    const account = demoAccounts.find(
      (acc) => acc.email === email && acc.password === password
    );
    if (account) {
      const u = { email: account.email, role: account.role, name: account.name };
      setUser(u);
      setJustRegistered(false);
      return true;
    }
    return false;
  };

  const register = (
    email: string,
    password: string,
    name: string,
    role: "hr" | "candidate"
  ): boolean => {
    if (demoAccounts.find((acc) => acc.email === email)) {
      return false;
    }
    demoAccounts.push({ email, password, name, role });
    setUser({ email, role, name });
    setJustRegistered(role === "candidate");
    return true;
  };

  const logout = () => {
    setUser(null);
    setJustRegistered(false);
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
