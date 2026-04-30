"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setErr(data.error ?? "เข้าสู่ระบบไม่สำเร็จ");
      return;
    }
    router.push(next || "/dashboard");
    router.refresh();
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 space-y-4"
    >
      <div>
        <label className="label">อีเมล</label>
        <input className="input" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <label className="label">รหัสผ่าน</label>
        <input className="input" name="password" type="password" required autoComplete="current-password" />
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn-accent w-full" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        เข้าสู่ระบบ
      </button>
    </motion.form>
  );
}
