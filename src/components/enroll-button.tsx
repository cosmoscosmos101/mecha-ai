"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export function EnrollButton({ courseId, referral }: { courseId: string; referral?: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string>("");

  async function enroll() {
    setState("loading");
    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, referral }),
    });
    const data = await res.json();
    if (!res.ok) {
      setState("err");
      setMsg(data.error ?? "สมัครไม่สำเร็จ");
      if (res.status === 401) router.push(`/login?next=/courses`);
      return;
    }
    setState("ok");
    setMsg("สมัครเรียนสำเร็จ! ");
    setTimeout(() => router.refresh(), 800);
  }

  return (
    <div className="mt-5">
      <button
        onClick={enroll}
        disabled={state === "loading" || state === "ok"}
        className="btn-accent w-full text-base py-3"
      >
        {state === "loading" && <Loader2 className="size-4 animate-spin" />}
        {state === "ok" && <CheckCircle2 className="size-4" />}
        {state === "ok" ? "สมัครแล้ว" : state === "loading" ? "กำลังสมัคร…" : "สมัครเรียนคอร์สนี้"}
      </button>
      <AnimatePresence>
        {msg && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-xs mt-2 text-center ${state === "err" ? "text-red-600" : "text-emerald-600"}`}
          >
            {msg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
