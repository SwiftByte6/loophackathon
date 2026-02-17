import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "faculty" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const mockUsers: Record<UserRole, User> = {
  student: { id: "s1", name: "Alex Chen", email: "alex.chen@university.edu", role: "student" },
  faculty: { id: "f1", name: "Dr. Sarah Mitchell", email: "s.mitchell@university.edu", role: "faculty" },
  admin: { id: "a1", name: "James Walker", email: "j.walker@university.edu", role: "admin" },
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const login = (role: UserRole) => setUser(mockUsers[role]);
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
