import { create } from "zustand";
import type { AuthUser } from "@anor/shared";

interface AuthState {
  user: AuthUser | null;
  role: AuthUser["role"] | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  token: null,
  isLoading: true,
  setUser: (user) =>
    set({
      user,
      role: user?.role ?? null,
      token: null
    }),
  setLoading: (isLoading) => set({ isLoading })
}));
