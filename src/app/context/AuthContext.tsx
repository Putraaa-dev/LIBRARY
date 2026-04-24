import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser, UserRole } from '../types';
import { DEFAULT_USERS } from '../data/mockData';
import type { User } from '../types';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY_AUTH = 'perpus_auth';
const STORAGE_KEY_USERS = 'perpus_users';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize users in localStorage if not exists
    const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    if (!storedUsers) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_USERS));
    }
    // Restore auth session
    const storedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
    if (storedAuth) {
      try {
        const user = JSON.parse(storedAuth) as AuthUser;
        setCurrentUser(user);
      } catch {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS;
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, message: 'Email atau password salah.' };
    if (found.status === 'inactive') return { success: false, message: 'Akun Anda dinonaktifkan. Hubungi administrator.' };
    const authUser: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      phone: found.phone,
      address: found.address,
      memberSince: found.memberSince,
      status: found.status,
      avatar: found.avatar,
      totalLoans: found.totalLoans,
    };
    setCurrentUser(authUser);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authUser));
    return { success: true, message: `Selamat datang, ${found.name}!` };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; message: string }> => {
    const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS;
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      password,
      role: 'user',
      phone: phone || '',
      address: '',
      memberSince: new Date().toISOString().split('T')[0],
      status: 'active',
      totalLoans: 0,
    };
    const updatedUsers = [...users, newUser];
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
    return { success: true, message: 'Registrasi berhasil! Silakan login.' };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }, []);

  const updateProfile = useCallback((data: Partial<AuthUser>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated));
    // Also update in users list
    const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    if (storedUsers) {
      const users: User[] = JSON.parse(storedUsers);
      const idx = users.findIndex(u => u.id === currentUser.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      }
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}