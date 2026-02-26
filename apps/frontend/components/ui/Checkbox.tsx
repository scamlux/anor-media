"use client";

import type { InputHTMLAttributes } from "react";

export function Checkbox(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return <input type="checkbox" className="h-4 w-4" {...props} />;
}
