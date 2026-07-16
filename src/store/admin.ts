import { create } from 'zustand';
import api from '@/lib/api';

interface AdminInfo {
  id: number;
  username: string;
}

interface AdminState {
  token: string | null;
  admin: AdminInfo | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  token: localStorage.getItem('admin_token'),
  admin: JSON.parse(localStorage.getItem('admin_info') || 'null'),
  isAuthenticated: !!localStorage.getItem('admin_token'),

  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { token, admin } = response.data;
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_info', JSON.stringify(admin));
    set({ token, admin, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    set({ token: null, admin: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('admin_token');
    const admin = localStorage.getItem('admin_info');
    set({
      token,
      admin: admin ? JSON.parse(admin) : null,
      isAuthenticated: !!token,
    });
  },
}));

export default useAdminStore;
