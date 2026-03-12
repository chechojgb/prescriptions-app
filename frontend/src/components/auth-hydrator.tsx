'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export function AuthHydrator({ user }: { user: any }) {
  const { setUser } = useAuth();

  useEffect(() => {
    // Cuando el cliente carga, le pasamos los datos del servidor al contexto
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return null; // No renderiza nada visual
}