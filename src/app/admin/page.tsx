import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { read } from "@/lib/db";
import { thb, fmtNum } from "@/lib/utils";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion-primitives";
import { TrendChart } from "@/components/trend-chart";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "admin") redirect("/dashboard");

  const db = await read();
  const totalRevenue = db.enrollments.reduce((s, e) => s + e.amount, 0);
  const totalCommission = db.enrollments.reduce((s, e) => s + e.commissionPaid, 0);
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });
  const enrollTrend = days.map((day) => ({
    day,
    n: db.enrollments.filter((e) => e.createdAt.startsWith(day)).length,
  }));

  const tutorEarnings = db.users
    .filter((u) => u.role === "tutor" || u.earnings > 0)
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 6);

  return (
    <div className="container-page py-12 space-y-10">
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">Admin Console</p>
        <h1 className="font-serif text-4xl text-ink-400">ภาพรวมระบบ</h1>
      </FadeUp>

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="ผู้ใช้ทั้งหมด" value={fmtNum(db.users.length)} />
        <Stat label="คอร์ส" value={fmtNum(db.courses.length)} />
        <Stat label="คลิป" value={fmtNum(db.videos.length)} />
        <Stat label="ยอดสมัคร" value={fmtNum(db.enrollments.length)} />
        <Stat label="รายได้รวม" value={thb(totalRevenue)} accent />
        <Stat label="คอมมิชชั่นจ่ายแล้ว" value={thb(totalCommission)} />
        <Stat label="ผู้ชมคลิปรวม" value={fmtNum(db.views.length)} />
        <Stat label="กำไรสุทธิ (ประมาณ)" value={thb(totalRevenue - totalCommission)} accent />
      </Stagger>

      <FadeUp className="card p-6">
        <h3 className="font-serif text-xl text-ink-400 mb-4">ยอดสมัคร 14 วันล่าสุด</h3>
        <TrendChart data={enrollTrend} color="#D97757" />
      </FadeUp>

      <div className="grid lg:grid-cols-2 gap-5">
        <FadeUp className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-ink-400">ติวเตอร์ที่มีรายได้สูง</h3>
            <Link href="/admin/users" className="text-xs text-coral-500 hover:underline">ดูทั้งหมด →</Link>
          </div>
          <ul className="divide-y divide-cream-300">
            {tutorEarnings.map((u) => (
              <li key={u.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-ink-300">{u.name}</div>
                  <div className="text-xs text-ink-50 font-mono">{u.referralCode} • {u.email}</div>
                </div>
                <span className="font-mono text-coral-500">{thb(u.earnings)}</span>
              </li>
            ))}
            {tutorEarnings.length === 0 && (
              <li className="py-6 text-center text-ink-50 text-sm">ยังไม่มีติวเตอร์ที่มีรายได้</li>
            )}
          </ul>
        </FadeUp>

        <FadeUp className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-ink-400">คอร์สยอดนิยม</h3>
            <Link href="/admin/courses" className="text-xs text-coral-500 hover:underline">จัดการ →</Link>
          </div>
          <ul className="divide-y divide-cream-300">
            {[...db.courses].sort((a, b) => b.enrolled - a.enrolled).slice(0, 6).map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <div className="font-medium text-ink-300 truncate">{c.titleTh}</div>
                  <div className="text-xs text-ink-50 font-mono">{c.id} • {c.discipline}</div>
                </div>
                <span className="text-ink-200">{fmtNum(c.enrolled)} คน</span>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>

      <FadeUp className="grid gap-3 md:grid-cols-3">
        <Link href="/admin/courses" className="card p-6 hover:bg-cream-50">
          <div className="font-serif text-xl text-ink-400">จัดการคอร์ส</div>
          <p className="text-xs text-ink-50 mt-1">เพิ่ม / แก้ไข / ลบ</p>
        </Link>
        <Link href="/admin/users" className="card p-6 hover:bg-cream-50">
          <div className="font-serif text-xl text-ink-400">จัดการผู้ใช้</div>
          <p className="text-xs text-ink-50 mt-1">role, commission rate</p>
        </Link>
        <Link href="/admin/videos" className="card p-6 hover:bg-cream-50">
          <div className="font-serif text-xl text-ink-400">จัดการคลิป</div>
          <p className="text-xs text-ink-50 mt-1">ตรวจสอบ tag, ลบ</p>
        </Link>
      </FadeUp>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <StaggerItem className={`stat-card ${accent ? "bg-coral-50 border-coral-200" : ""}`}>
      <div className="text-xs text-ink-100">{label}</div>
      <div className="font-serif text-3xl text-ink-400">{value}</div>
    </StaggerItem>
  );
}
