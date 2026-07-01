"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type UserAddress = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string; // simple btoa encoding — not production-grade
  createdAt: string;
};

export type UserOrder = {
  id: string;
  date: string;
  status: "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  total: string;
  items: { name: string; image: string; price: string; quantity: number }[];
};

type UserContextValue = {
  user: UserProfile | null;
  addresses: UserAddress[];
  orders: UserOrder[];
  isLoggedIn: boolean;

  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, phone: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, "name" | "phone">>) => void;
  changePassword: (current: string, next: string) => { ok: boolean; error?: string };

  addAddress: (address: Omit<UserAddress, "id">) => void;
  updateAddress: (id: string, updates: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

const USERS_KEY = "lakshiraah-users-v1";
const SESSION_KEY = "lakshiraah-session-v1";
const ADDRESSES_KEY = "lakshiraah-addresses-v1";
const ORDERS_KEY = "lakshiraah-user-orders-v1";

function hashPassword(pw: string) {
  return btoa(unescape(encodeURIComponent(pw)));
}

function verifyPassword(pw: string, hash: string) {
  return hashPassword(pw) === hash;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
        const found = users.find((u) => u.id === sessionId);
        if (found) {
          setUser(found);
          const allAddresses: Record<string, UserAddress[]> = JSON.parse(
            localStorage.getItem(ADDRESSES_KEY) ?? "{}"
          );
          setAddresses(allAddresses[sessionId] ?? []);
          const allOrders: Record<string, UserOrder[]> = JSON.parse(
            localStorage.getItem(ORDERS_KEY) ?? "{}"
          );
          setOrders(allOrders[sessionId] ?? []);
        }
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  const persistAddresses = (userId: string, addrs: UserAddress[]) => {
    const all: Record<string, UserAddress[]> = JSON.parse(localStorage.getItem(ADDRESSES_KEY) ?? "{}");
    all[userId] = addrs;
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(all));
  };

  const login = (email: string, password: string) => {
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { ok: false, error: "No account found with this email." };
    if (!verifyPassword(password, found.passwordHash)) return { ok: false, error: "Incorrect password." };
    setUser(found);
    localStorage.setItem(SESSION_KEY, found.id);
    const allAddresses: Record<string, UserAddress[]> = JSON.parse(localStorage.getItem(ADDRESSES_KEY) ?? "{}");
    setAddresses(allAddresses[found.id] ?? []);
    const allOrders: Record<string, UserOrder[]> = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "{}");
    setOrders(allOrders[found.id] ?? []);
    return { ok: true };
  };

  const register = (name: string, email: string, phone: string, password: string) => {
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, newUser.id);
    setUser(newUser);
    setAddresses([]);
    setOrders([]);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setAddresses([]);
    setOrders([]);
  };

  const updateProfile = (updates: Partial<Pick<UserProfile, "name" | "phone">>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    localStorage.setItem(USERS_KEY, JSON.stringify(users.map((u) => (u.id === user.id ? updated : u))));
  };

  const changePassword = (current: string, next: string) => {
    if (!user) return { ok: false, error: "Not logged in." };
    if (!verifyPassword(current, user.passwordHash)) return { ok: false, error: "Current password is incorrect." };
    const updated = { ...user, passwordHash: hashPassword(next) };
    setUser(updated);
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    localStorage.setItem(USERS_KEY, JSON.stringify(users.map((u) => (u.id === user.id ? updated : u))));
    return { ok: true };
  };

  const addAddress = (address: Omit<UserAddress, "id">) => {
    if (!user) return;
    const newAddr: UserAddress = { ...address, id: `addr-${Date.now()}` };
    const updated = address.isDefault
      ? [...addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
      : [...addresses, newAddr];
    setAddresses(updated);
    persistAddresses(user.id, updated);
  };

  const updateAddress = (id: string, updates: Partial<UserAddress>) => {
    if (!user) return;
    const updated = addresses.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setAddresses(updated);
    persistAddresses(user.id, updated);
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    persistAddresses(user.id, updated);
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    persistAddresses(user.id, updated);
  };

  if (!hydrated) return null;

  return (
    <UserContext.Provider
      value={{
        user,
        addresses,
        orders,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
