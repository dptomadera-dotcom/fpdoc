'use client';
import { create } from 'zustand';
import { authService } from '@/services/auth.service';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  onboardingCompleted?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  setUser: (user: UserProfile, token: string) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
  syncFromService: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
  isAuthenticated: () => get().user !== null,
  syncFromService: () => {
    const user = authService.getCurrentUser() as UserProfile | null;
    const token = authService.getToken() ?? null;
    set({ user, token });
  },
}));
