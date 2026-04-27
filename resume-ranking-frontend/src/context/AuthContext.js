import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const USERS = [
  { id: 1, name: "HR Manager", email: "hr@resume.com", password: "hr123", role: "hr" },
  { id: 2, name: "Alice Johnson", email: "alice@email.com", password: "alice123", role: "candidate" },
  { id: 3, name: "Bob Smith", email: "bob@email.com", password: "bob123", role: "candidate" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState(USERS);

  const login = (email, password) => {
    const found = allUsers.find((u) => u.email === email && u.password === password);
    if (found) { setUser(found); return true; }
    return false;
  };

  const [justRegistered, setJustRegistered] = useState(false);

  const register = (name, email, password) => {
    if (allUsers.find((u) => u.email === email)) return false;
    const newUser = { id: Date.now(), name, email, password, role: "candidate", interests: [] };
    setAllUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setJustRegistered(true);
    return true;
  };

  const saveInterests = (interests) => {
    setUser((prev) => ({ ...prev, interests }));
    setAllUsers((prev) => prev.map((u) => u.id === user?.id ? { ...u, interests } : u));
    setJustRegistered(false);
  };

  const skipInterests = () => setJustRegistered(false);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, justRegistered, saveInterests, skipInterests }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
