"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";

export function Hero() {
  const blobRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!blobRef.current) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
    tl.to(blobRef.current, { x: 30, y: -20, scale: 1.1, duration: 6 })
      .to(blobRef.current, { x: -20, y: 25, scale: 0.95, duration: 6 });

    if (wordsRef.current) {
      const words = wordsRef.current.querySelectorAll<HTMLElement>("[data-word]");
      gsap.fromTo(
        words,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: "power3.out", delay: 0.1 }
      );
    }
    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative overflow-hidden hero-grad">
      <div
        ref={blobRef}
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full
                   bg-coral-300/30 blur-3xl"
      />
      <div className="container-page relative pt-20 pb-24 md:pt-28 md:pb-32">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pill mb-6"
        >
          <span className="size-1.5 rounded-full bg-coral-400 animate-pulse" />
          เปิดรับติวเตอร์ใหม่ — รับคอมมิชชั่นทันที
        </motion.span>

        <h1 ref={wordsRef} className="font-serif text-5xl md:text-7xl text-ink-400 leading-[1.05] text-balance max-w-4xl">
          {"ติววิศวะ ออกแบบ และทฤษฎี".split(" ").map((w, i) => (
            <span key={i} data-word className="inline-block mr-3 will-change-transform">
              {i === 1 ? <em className="text-coral-400 not-italic font-serif">{w}</em> : w}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 max-w-2xl text-lg text-ink-100 leading-relaxed"
        >
          แพลตฟอร์มเรียน-สอนสำหรับชาววิศวกรรม กลศาสตร์ พลศาสตร์ ของไหล วงจร โครงสร้าง การออกแบบ —
          พร้อม ML ช่วยจัดเส้นทางการเรียนรู้ และระบบคอมมิชชั่นให้ผู้สอน
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link href="/courses" className="btn-accent">เริ่มเรียนเลย</Link>
          <Link href="/signup?role=tutor" className="btn-outline">เป็นติวเตอร์</Link>
        </motion.div>
      </div>
    </section>
  );
}
