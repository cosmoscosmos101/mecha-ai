"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Sparkles, Star, Users, Wallet, PlayCircle, Tag, Check } from "lucide-react";

type Step = {
  n: number;
  kicker: string;
  title: string;
  desc: string;
};

const STEPS: Step[] = [
  {
    n: 1,
    kicker: "เลือกสาขา",
    title: "เลือกสาขาที่ใช่สำหรับคุณ",
    desc: "เครื่องกล โยธา ไฟฟ้า อุตสาหการ ออกแบบ หรือทฤษฎี — กรองตามความสนใจ ระดับความยาก และคำค้นได้ทันที",
  },
  {
    n: 2,
    kicker: "ML แนะนำ",
    title: "ดูคอร์สที่ระบบแนะนำให้",
    desc: "ML เรียงคอร์สตามคะแนน ยอดผู้เรียน และความใกล้เคียงกับสิ่งที่คุณเคยดู — ไม่ต้องไล่หาเอง",
  },
  {
    n: 3,
    kicker: "สมัครเรียน",
    title: "สมัครเรียน + ใช้โค้ดเพื่อน",
    desc: "กรอกโค้ดติวเตอร์ตอนสมัคร — เพื่อนได้คอมมิชชั่น 30% โดยที่คุณจ่ายราคาเดิม คุ้มทั้งสองฝ่าย",
  },
  {
    n: 4,
    kicker: "เริ่มเรียน",
    title: "ดูคลิป + ติดตามใน dashboard",
    desc: "เข้าถึงคลิปติวจากชุมชนตลอดชีพ ดูยอดสะสมในแดชบอร์ด และอัปโหลดคลิปของคุณเองเพื่อเป็นติวเตอร์",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 60%", "end 40%"],
  });

  // Map scroll progress (0..1) to step index (0..3) without per-frame re-renders.
  // We only setState when the integer index actually changes.
  const stepProgress = useTransform(scrollYProgress, [0, 1], [0, STEPS.length]);
  useMotionValueEvent(stepProgress, "change", (v) => {
    const idx = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  return (
    <section ref={sectionRef} className="container-page py-16 md:py-20">
      <FadeHeader />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Sticky visual stage (desktop) — collapses inline on mobile */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <VisualStage active={active} />
          <ProgressDots active={active} total={STEPS.length} />
        </div>

        {/* Scrolling steps */}
        <ol className="space-y-24 lg:space-y-32">
          {STEPS.map((step, i) => (
            <StepBlock key={step.n} step={step} index={i} active={active} />
          ))}
        </ol>
      </div>

      <CTAFooter />
    </section>
  );
}

function FadeHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl"
    >
      <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">
        เริ่มเรียนยังไง
      </p>
      <h2 className="font-serif text-4xl md:text-5xl text-ink-400 leading-[1.1] text-balance">
        4 ขั้นตอนตั้งแต่เปิดเว็บ จนเริ่มเรียนได้จริง
      </h2>
      <p className="mt-4 text-ink-100 leading-relaxed">
        ออกแบบให้สั้นที่สุด เข้าใจระบบครบถ้วนใน 30 วินาที
      </p>
    </motion.div>
  );
}

function StepBlock({ step, index, active }: { step: Step; index: number; active: number }) {
  const isActive = active === index;
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="flex items-baseline gap-4 mb-3">
        <motion.span
          animate={{
            scale: isActive ? 1.05 : 1,
            color: isActive ? "#C95F3D" : "#5A5953",
          }}
          transition={{ duration: 0.4 }}
          className="font-serif text-5xl md:text-6xl tabular-nums"
        >
          {String(step.n).padStart(2, "0")}
        </motion.span>
        <span className="text-xs uppercase tracking-widest text-coral-400 font-mono">
          {step.kicker}
        </span>
      </div>
      <h3 className="font-serif text-2xl md:text-3xl text-ink-400 mb-3 text-balance">
        {step.title}
      </h3>
      <p className="text-ink-100 leading-relaxed max-w-xl">{step.desc}</p>

      {/* Inline mini visual for mobile — hidden on lg */}
      <div className="lg:hidden mt-6">
        <VisualStage active={index} compact />
      </div>
    </motion.li>
  );
}

function ProgressDots({ active, total }: { active: number; total: number }) {
  return (
    <div className="hidden lg:flex justify-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i === active ? "w-8 bg-coral-400" : "w-1.5 bg-cream-400"
          }`}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visual stage — crossfades 4 mockups based on `active`                       */
/* -------------------------------------------------------------------------- */

function VisualStage({ active, compact = false }: { active: number; compact?: boolean }) {
  const visuals = [<Visual1 />, <Visual2 />, <Visual3 />, <Visual4 />];
  const heightCls = compact ? "h-[280px]" : "h-[420px] md:h-[480px]";

  return (
    <div
      className={`relative ${heightCls} card overflow-hidden bg-cream-50 grain p-6 md:p-8`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.02, y: -4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-6 md:inset-8 flex flex-col"
        >
          {visuals[active]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const DISCIPLINES = [
  { key: "mech", label: "เครื่องกล", picked: true },
  { key: "civ", label: "โยธา" },
  { key: "ee", label: "ไฟฟ้า" },
  { key: "ie", label: "อุตสาหการ" },
  { key: "des", label: "ออกแบบ" },
  { key: "th", label: "ทฤษฎี" },
];

function Visual1() {
  return (
    <div className="flex-1 flex flex-col">
      <p className="text-[10px] uppercase tracking-widest text-ink-50 font-mono mb-3">
        /courses
      </p>
      <div className="flex flex-wrap gap-2">
        {DISCIPLINES.map((d, i) => (
          <motion.span
            key={d.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.35 }}
            className={`pill text-sm ${
              d.picked
                ? "bg-coral-400 text-cream-50 border-coral-400 shadow-soft"
                : ""
            }`}
          >
            {d.label}
          </motion.span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-6 rounded-xl border border-cream-300 bg-cream-100 px-4 py-3 font-mono text-xs text-ink-200"
      >
        <span className="text-coral-500">filter</span>(courses, &#123; discipline:{" "}
        <span className="text-coral-500">&quot;mechanical&quot;</span> &#125;)
      </motion.div>
      <div className="mt-auto flex items-center gap-2 text-xs text-ink-50">
        <Sparkles className="size-3.5 text-coral-400" />
        <span>กรองทันที — ไม่ต้องเลื่อนผ่านคอร์สที่ไม่เกี่ยว</span>
      </div>
    </div>
  );
}

const REC_CARDS = [
  { id: "ME-101", title: "Statics", rating: 4.8, badge: "ML #1" },
  { id: "ME-102", title: "Dynamics", rating: 4.6 },
  { id: "ME-103", title: "Mechanics of Materials", rating: 4.7 },
];

function Visual2() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="size-3.5 text-coral-400" />
        <p className="text-[10px] uppercase tracking-widest text-ink-50 font-mono">
          ML แนะนำ
        </p>
      </div>
      <div className="space-y-2.5">
        {REC_CARDS.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.4 }}
            className={`rounded-xl border px-4 py-3 flex items-center justify-between ${
              i === 0
                ? "border-coral-200 bg-coral-50"
                : "border-cream-300 bg-white"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-ink-50">{c.id}</span>
                {c.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-coral-400 text-cream-50">
                    {c.badge}
                  </span>
                )}
              </div>
              <div className="font-medium text-ink-300 text-sm truncate">
                {c.title}
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-ink-200 shrink-0">
              <Star className="size-3.5 fill-coral-400 stroke-coral-400" />
              {c.rating}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="mt-auto rounded-lg bg-ink-400 px-4 py-2.5 font-mono text-xs text-cream-100"
      >
        cosine_similarity(profile, courses) → top_k(3)
      </motion.div>
    </div>
  );
}

function Visual3() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-ink-50 font-mono">
        /courses/statics
      </p>

      <div className="rounded-xl border border-cream-300 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-serif text-2xl text-ink-400">฿2,790</span>
          <span className="text-xs text-ink-50">เข้าถึงตลอดชีพ</span>
        </div>

        {/* Referral input */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-lg border border-coral-200 bg-coral-50 px-3 py-2 flex items-center gap-2 mb-3"
        >
          <Tag className="size-3.5 text-coral-500" />
          <span className="font-mono text-xs text-coral-600">TUTOR1</span>
          <span className="ml-auto text-[10px] text-coral-500 font-mono">
            ✓ โค้ดถูกต้อง
          </span>
        </motion.div>

        {/* Animated enroll button → checkmark */}
        <motion.div
          initial={{ scale: 0.96 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 22 }}
          className="rounded-lg bg-ink-400 text-cream-50 px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Check className="size-4" />
          สมัครเรียนสำเร็จ
        </motion.div>
      </div>

      {/* Commission badge floats in */}
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.85, type: "spring", stiffness: 300, damping: 18 }}
        className="self-end rounded-lg bg-coral-400 text-cream-50 px-4 py-2 flex items-center gap-2 shadow-lift"
      >
        <Wallet className="size-4" />
        <div className="text-xs">
          <div className="opacity-80">ติวเตอร์ได้</div>
          <div className="font-mono font-medium">+฿837</div>
        </div>
      </motion.div>
    </div>
  );
}

const CHART_BARS = [3, 5, 4, 7, 6, 9, 8];

function Visual4() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-ink-50 font-mono">
        /dashboard
      </p>

      {/* Mini video frame */}
      <div className="rounded-xl border border-cream-300 bg-ink-400 p-4 flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="size-10 rounded-full bg-coral-400 grid place-items-center shrink-0"
        >
          <PlayCircle className="size-5 text-cream-50" fill="currentColor" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="text-cream-50 text-sm font-medium truncate">
            Truss Equilibrium ตอน 2
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {["truss", "equilibrium", "force"].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + 0.08 * i, duration: 0.3 }}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cream-50/10 text-cream-100"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Mini chart drawing */}
      <div className="rounded-xl border border-cream-300 bg-white p-4">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-ink-100 flex items-center gap-1.5">
            <Users className="size-3.5" /> สมัครจากโค้ดคุณ (7 วัน)
          </span>
          <span className="font-mono text-coral-500">+42</span>
        </div>
        <div className="flex items-end gap-1.5 h-16">
          {CHART_BARS.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(h / 9) * 100}%` }}
              transition={{ delay: 0.4 + 0.06 * i, duration: 0.5, ease: "easeOut" }}
              className="flex-1 bg-coral-400 rounded-t"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CTAFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="mt-20 flex flex-wrap items-center gap-3"
    >
      <Link href="/courses" className="btn-accent inline-flex items-center gap-2">
        ดูคอร์สทั้งหมด <ArrowRight className="size-4" />
      </Link>
      <Link href="/signup" className="btn-outline">
        สมัครฟรี — เริ่มเรียนเลย
      </Link>
    </motion.div>
  );
}
