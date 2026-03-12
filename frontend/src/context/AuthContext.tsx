'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { logout as logoutFn } from '@/lib/auth';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const logout = () => {
    clearAuth();
    logoutFn();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);