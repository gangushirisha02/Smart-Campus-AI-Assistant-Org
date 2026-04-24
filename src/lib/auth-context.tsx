import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { logActivity } from "@/lib/campus-store";

export type UserRole = "admin" | "student";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "campus_users";
const SESSION_KEY = "campus_user";

function getStoredUsers(): Record<string, { password: string; user: AuthUser }> {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEY);
  const defaults: Record<string, { password: string; user: AuthUser }> = {
    "admin@campus.edu": {
      password: "admin123",
      user: { id: "1", name: "Admin User", email: "admin@campus.edu", role: "admin" },
    },
    "student@campus.edu": {
      password: "student123",
      user: { id: "2", name: "Student User", email: "student@campus.edu", role: "student" },
    },
  };
  if (!stored) return defaults;
  return { ...defaults, ...JSON.parse(stored) };
}

function saveUser(email: string, entry: { password: string; user: AuthUser }) {
  const users = getStoredUsers();
  users[email] = entry;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    const users = getStoredUsers();
    const entry = users[email];
    if (!entry || entry.password !== password || entry.user.role !== role) {
      throw new Error("Invalid credentials");
    }
    setUser(entry.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(entry.user));
    logActivity("Login", entry.user.name, role);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    const users = getStoredUsers();
    if (users[email]) {
      throw new Error("Email already in use");
    }
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
    };
    saveUser(email, { password, user: newUser });
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    logActivity("Signup", newUser.name, role);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
