"use client";

import type { PropsWithChildren } from "react";
import { useAuthInit } from "@/hooks/useAuthInit";

export function AppProviders({ children }: PropsWithChildren) {
  useAuthInit();
  return <>{children}</>;
}
