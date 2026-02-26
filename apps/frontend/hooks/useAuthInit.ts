"use client";

import { useEffect } from "react";
import { me } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export function useAuthInit(): void {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await me();
        if (mounted) setUser(response.user);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setLoading, setUser]);
}
