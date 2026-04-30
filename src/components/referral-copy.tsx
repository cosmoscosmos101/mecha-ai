"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function ReferralCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        const url = `${window.location.origin}/signup?ref=${code}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="btn-outline text-xs"
      title="คัดลอกลิงก์เชิญเพื่อน"
    >
      {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
      {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
    </button>
  );
}
