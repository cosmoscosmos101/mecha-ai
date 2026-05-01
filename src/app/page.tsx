import Link from "next/link";
import { read } from "@/lib/db";
import { CourseCard } from "@/components/course-card";
import { Stagger, StaggerItem, FadeUp } from "@/components/motion-primitives";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { fmtNum } from "@/lib/utils";
import { ArrowRight, Sparkles, Wrench, ChartBar, BadgeCheck } from "lucide-react";

export default async function HomePage() {
  const db = await read();
  const featured = [...db.courses]
    .sort((a, b) => b.rating * b.enrolled - a.rating * a.enrolled)
    .slice(0, 6);
  const totalEnroll = db.courses.reduce((s, c) => s + c.enrolled, 0);
  const totalCourses = db.courses.length;
  const totalTutors = db.users.filter((u) => u.role === "tutor").length;

  return (
    <>
      <Hero />

      <section className="container-page mt-16">
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={<Wrench className="size-4" />} label="คอร์สที่เปิดสอน" value={fmtNum(totalCourses)} />
          <Stat icon={<BadgeCheck className="size-4" />} label="ผู้สมัครเรียน" value={fmtNum(totalEnroll)} />
          <Stat icon={<Sparkles className="size-4" />} label="ติวเตอร์ในระบบ" value={fmtNum(Math.max(totalTutors, 1))} />
          <Stat icon={<ChartBar className="size-4" />} label="คอมมิชชั่นเฉลี่ย" value="30%" />
        </Stagger>
      </section>

      <HowItWorks />

      <section className="container-page mt-24">
        <FadeUp className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">คอร์สแนะนำ</p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink-400">เริ่มจากที่นิยมที่สุด</h2>
          </div>
          <Link href="/courses" className="btn-ghost text-sm hidden md:inline-flex">
            ดูทั้งหมด <ArrowRight className="size-4" />
          </Link>
        </FadeUp>
        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <StaggerItem key={c.id}>
              <CourseCard course={c} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container-page mt-28">
        <FadeUp className="card p-10 md:p-14 hero-grad">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-coral-400 mb-3">สำหรับติวเตอร์</p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink-400 mb-4 text-balance">
                สอนเก่ง? มาแบ่งปันความรู้ — รับคอมมิชชั่น 30% ทันที
              </h2>
              <p className="text-ink-100 leading-relaxed mb-6">
                อัปโหลดคลิปติว ผูกโค้ดแนะนำ ระบบจะคำนวณรายได้ให้อัตโนมัติเมื่อมีคนสมัครจากลิงก์ของคุณ
                ML จะช่วย tag คลิปและแนะนำให้ผู้เรียนตรงกลุ่ม
              </p>
              <div className="flex gap-3">
                <Link href="/signup?role=tutor" className="btn-accent">เป็นติวเตอร์</Link>
                <Link href="/upload" className="btn-outline">อัปโหลดคลิปแรก</Link>
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl border border-cream-400 bg-cream-50 p-6 grain">
              <div className="absolute inset-6 grid grid-rows-3 gap-3">
                <div className="rounded-lg bg-coral-400/10 border border-coral-200 px-3 flex items-center text-xs font-mono text-coral-500">
                  upload → tutorial.mp4 ✓
                </div>
                <div className="rounded-lg bg-cream-200 px-3 flex items-center text-xs font-mono text-ink-100">
                  ml.autoTag → [&quot;truss&quot;, &quot;equilibrium&quot;]
                </div>
                <div className="rounded-lg bg-ink-400 text-cream-100 px-3 flex items-center text-xs font-mono">
                  commission +฿837 (30% × ฿2,790)
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <StaggerItem className="stat-card">
      <div className="flex items-center gap-2 text-ink-100 text-xs">
        {icon} {label}
      </div>
      <div className="font-serif text-3xl text-ink-400">{value}</div>
    </StaggerItem>
  );
}
