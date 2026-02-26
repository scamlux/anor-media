"use client";

import type { PropsWithChildren } from "react";
import type { UserRole } from "@anor/shared";
import { useAuthStore } from "@/store/authStore";

interface RoleGuardProps {
  allow: UserRole[];
}

export function RoleGuard({ allow, children }: PropsWithChildren<RoleGuardProps>) {
  const { role } = useAuthStore();
  if (!role || !allow.includes(role)) {
    return <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm">Access restricted by role.</div>;
  }

  return <>{children}</>;
}
