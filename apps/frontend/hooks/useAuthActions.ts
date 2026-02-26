"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, logout } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export function useAuthActions() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (payload: { email: string; password: string }): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login(payload);
      setUser(response.user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
      router.replace("/auth");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signOut,
    isLoading,
    error
  };
}
