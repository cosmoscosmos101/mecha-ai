"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, CheckCircle2, X, FileVideo, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseLite { id: string; titleTh: string; discipline: string }

export function UploadForm({ courses }: { courses: CourseLite[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<"idle" | "uploading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");

  // live ML tag preview as user types
  useEffect(() => {
    if (!title && !description) {
      setTags([]);
      return;
    }
    const id = setTimeout(async () => {
      const res = await fetch("/api/ml/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `${title} ${description}` }),
      });
      const data = await res.json();
      setTags(data.tags ?? []);
    }, 300);
    return () => clearTimeout(id);
  }, [title, description]);

  function pick(f: File | null | undefined) {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setErr("กรุณาเลือกไฟล์วิดีโอ");
      return;
    }
    setErr(null);
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return setErr("กรุณาเลือกไฟล์");
    setState("uploading");
    setErr(null);
    setProgress(0);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("description", description);
    fd.append("courseId", courseId);

    // XHR for upload progress (fetch lacks native progress)
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setState("ok");
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        setState("err");
        try { setErr(JSON.parse(xhr.responseText).error ?? "อัปโหลดไม่สำเร็จ"); }
        catch { setErr("อัปโหลดไม่สำเร็จ"); }
      }
    };
    xhr.onerror = () => { setState("err"); setErr("เชื่อมต่อไม่ได้"); };
    xhr.send(fd);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "card p-10 text-center cursor-pointer transition border-dashed",
          drag ? "border-coral-400 bg-coral-50" : "border-cream-400"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cream-200 text-coral-400">
                <UploadCloud className="size-7" />
              </div>
              <div>
                <p className="font-serif text-xl text-ink-400">ลากไฟล์มาวาง หรือคลิกเลือก</p>
                <p className="text-xs text-ink-50 mt-1">รองรับ MP4 / WebM / MOV ไม่เกิน 200MB</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="have"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 text-left"
            >
              <FileVideo className="size-8 text-coral-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink-300 truncate">{file.name}</p>
                <p className="text-xs text-ink-50">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); setProgress(0); setState("idle"); }}
                className="p-1.5 rounded-full hover:bg-cream-200"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="label">หัวข้อคลิป</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น สอนแก้โจทย์ Truss แบบ method of joints ภายใน 8 นาที"
            required
          />
        </div>
        <div>
          <label className="label">วิชา</label>
          <select className="input" value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.titleTh}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">ML auto-tags</label>
          <div className="rounded-xl border border-cream-400 bg-cream-50 px-3 py-2.5 min-h-[42px] flex flex-wrap gap-1.5 items-center">
            {tags.length === 0 ? (
              <span className="text-xs text-ink-50 inline-flex items-center gap-1">
                <Sparkles className="size-3" /> tag จะปรากฏเมื่อพิมพ์
              </span>
            ) : (
              tags.map((t) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pill bg-coral-50 border-coral-200 text-coral-500"
                >
                  {t}
                </motion.span>
              ))
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="label">รายละเอียด</label>
          <textarea
            className="input min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="อธิบายเนื้อหา หัวข้อย่อย โจทย์ที่ครอบคลุม"
          />
        </div>
      </div>

      {state === "uploading" && (
        <div className="rounded-xl bg-cream-50 border border-cream-300 p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-ink-200 inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" /> กำลังอัปโหลด…
            </span>
            <span className="font-mono text-ink-300">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-cream-300 overflow-hidden">
            <motion.div
              className="h-full bg-coral-400"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>
      )}
      {state === "ok" && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 inline-flex items-center gap-2">
          <CheckCircle2 className="size-4" /> อัปโหลดสำเร็จ! กำลังพาไปแดชบอร์ด…
        </div>
      )}
      {err && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{err}</div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-accent" disabled={!file || state === "uploading"}>
          {state === "uploading" ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
          อัปโหลดและเผยแพร่
        </button>
      </div>
    </form>
  );
}
