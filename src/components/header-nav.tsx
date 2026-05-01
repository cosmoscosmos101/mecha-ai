"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/lib/auth";

const items = [
  { href: "/start", label: "เริ่มต้น" },
  { href: "/courses", label: "คอร์ส" },
  { href: "/upload", label: "อัปโหลดคลิป" },
  { href: "/dashboard", label: "แดชบอร์ด" },
];

export function HeaderNav({ session }: { session: SessionPayload | null }) {
  const path = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {items.map((it) => {
        const active = path === it.href || path.startsWith(it.href + "/");
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-sm transition",
              active ? "text-ink-400" : "text-ink-100 hover:text-ink-300"
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-full bg-cream-50 border border-cream-400/80 shadow-soft"
              />
            )}
            <span className="relative">{it.label}</span>
          </Link>
        );
      })}
      <div className="mx-2 h-5 w-px bg-cream-400" />
      {session ? (
        <>
          {session.role === "admin" && (
            <Link href="/admin" className="btn-ghost text-sm">Admin</Link>
          )}
          <span className="text-xs text-ink-100 px-2">สวัสดี, {session.name}</span>
          <form action="/api/auth/logout" method="post">
            <button className="btn-outline text-sm">ออกจากระบบ</button>
          </form>
        </>
      ) : (
        <>
          <Link href="/login" className="btn-ghost text-sm">เข้าสู่ระบบ</Link>
          <Link href="/signup" className="btn-accent text-sm">สมัคร</Link>
        </>
      )}
    </nav>
  );
}
