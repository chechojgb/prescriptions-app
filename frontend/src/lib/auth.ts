import api from './axios';
import { useAuthStore } from '@/store/authStore';

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  
  const { data: profile } = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${data.accessToken}` },
  });

  useAuthStore.getState().setAuth(profile, data.accessToken, data.refreshToken);
  return profile;
}

export async function logout() {
  useAuthStore.getState().clearAuth();
  window.location.href = '/login';
}

export function getUser() {
  return useAuthStore.getState().user;
}

export function isAuthenticated() {
  return !!useAuthStore.getState().accessToken;
}