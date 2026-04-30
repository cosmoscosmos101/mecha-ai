"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function SignupForm({ defaultRole, referral }: { defaultRole?: string; referral?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "tutor">(
    defaultRole === "tutor" ? "tutor" : "student"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
        name: fd.get("name"),
        role,
        referral,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setErr(data.error ?? "สมัครไม่สำเร็จ");
      return;
    }
    router.push("/dashboard");
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
        <label className="label">ฉันคือ</label>
        <div className="grid grid-cols-2 gap-2">
          {(["student", "tutor"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-xl border px-3 py-2.5 text-sm transition ${
                role === r
                  ? "bg-ink-400 text-cream-100 border-ink-400"
                  : "bg-cream-50 text-ink-200 border-cream-400"
              }`}
            >
              {r === "student" ? "ผู้เรียน" : "ติวเตอร์"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">ชื่อที่แสดง</label>
        <input className="input" name="name" required />
      </div>
      <div>
        <label className="label">อีเมล</label>
        <input className="input" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <label className="label">รหัสผ่าน (อย่างน้อย 8 ตัว)</label>
        <input className="input" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      {referral && (
        <p className="text-xs text-ink-100 bg-coral-50 rounded-lg px-3 py-2">
          ได้รับการแนะนำจากโค้ด <span className="font-mono text-coral-500">{referral}</span> — ติวเตอร์จะได้รับคอมมิชชั่นจากการสมัครของคุณ
        </p>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn-accent w-full" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        สมัครสมาชิก
      </button>
      <p className="text-xs text-ink-50 text-center">
        เป็น{role === "tutor" ? "ติวเตอร์" : "ผู้เรียน"} — รับคอมมิชชั่น {role === "tutor" ? "30%" : "10%"} จากการแนะนำเพื่อน
      </p>
    </motion.form>
  );
}
