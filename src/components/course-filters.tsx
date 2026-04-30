"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const disciplines = [
  { v: "", label: "ทั้งหมด" },
  { v: "mechanical", label: "เครื่องกล" },
  { v: "civil", label: "โยธา" },
  { v: "electrical", label: "ไฟฟ้า" },
  { v: "industrial", label: "อุตสาหการ" },
  { v: "design", label: "ออกแบบ" },
  { v: "theory", label: "ทฤษฎี" },
];

export function CourseFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();
  const current = sp.get("d") ?? "";
  const q = sp.get("q") ?? "";

  function update(next: { d?: string; q?: string }) {
    const params = new URLSearchParams(sp.toString());
    if (next.d !== undefined) {
      if (next.d) params.set("d", next.d);
      else params.delete("d");
    }
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    startTransition(() => router.push(`/courses?${params.toString()}`));
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <div className="flex gap-2 flex-wrap">
        {disciplines.map((d) => (
          <button
            key={d.v}
            onClick={() => update({ d: d.v })}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm border transition",
              current === d.v
                ? "bg-ink-400 text-cream-100 border-ink-400"
                : "bg-cream-50 text-ink-200 border-cream-400 hover:border-ink-200"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className="relative md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-50" />
        <input
          defaultValue={q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="ค้นหา (เช่น beam, fluid, fourier)"
          className="input pl-9 pr-9"
        />
        {q && (
          <button
            onClick={() => update({ q: "" })}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-ink-50 hover:text-ink-300"
            aria-label="clear"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {pending && <span className="text-xs text-ink-50">กำลังกรอง…</span>}
    </div>
  );
}
