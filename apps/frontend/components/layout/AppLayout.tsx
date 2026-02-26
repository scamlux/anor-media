"use client";

import Link from "next/link";
import type { PropsWithChildren } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/calendar", label: "Calendar" },
  { href: "/posts", label: "Posts" },
  { href: "/settings", label: "Settings" }
];

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen grid-cols-[240px_1fr] md:grid">
      <aside className="bg-primary p-4 text-white">
        <h1 className="mb-6 text-xl font-bold">ANOR MEDIA</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} className="block rounded px-3 py-2 hover:bg-white/15" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
