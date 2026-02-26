"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export function Button({ variant = "primary", children, className = "", ...props }: PropsWithChildren<ButtonProps>) {
  const styles =
    variant === "primary"
      ? "bg-primary text-white"
      : variant === "danger"
        ? "bg-danger text-white"
        : "bg-white text-slate-800 border border-slate-300";

  return (
    <button className={`${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
