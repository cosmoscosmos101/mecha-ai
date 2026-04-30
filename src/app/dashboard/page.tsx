import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, findUserById } from "@/lib/auth";
import { read } from "@/lib/db";
import { thb, fmtNum } from "@/lib/utils";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion-primitives";
import { TrendChart } from "@/components/trend-chart";
import { TrendingUp, Users, Wallet, PlayCircle, Copy } from "lucide-react";
import { ReferralCopyButton } from "@/components/referral-copy";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");
  const user = await findUserById(session.sub);
  if (!user) redirect("/login");

  const db = await read();
  const myEnrollments = db.enrollments.filter((e) => e.userId === user.id);
  const myReferralCode = user.referralCode;
  const referralEnrolls = db.enrollments.filter((e) => e.referralCode === myReferralCode);
  const myVideos = db.videos.filter((v) => v.uploaderId === user.id);
  const totalViews = myVideos.reduce((s, v) => s + v.views, 0);

  // build 7-day signup/view trend
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const signupTrend = days.map((day) => ({
    day,
    n: referralEnrolls.filter((e) => e.createdAt.startsWith(day)).length,
  }));
  const viewTrend = days.map((day) => ({
    day,
    n: db.views.filter((v) => v.ts.startsWith(day) &&
      myVideos.some((mv) => mv.id === v.videoId)).length,
  }));

  return (
    <div className="container-page py-12 space-y-10">
      <FadeUp className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">แดชบอร์ดของคุณ</p>
          <h1 className="font-serif text-4xl text-ink-400">สวัสดี {user.name}</h1>
          <p className="text-ink-100 mt-1 text-sm">บทบาท: {user.role} • คอมมิชชั่น {Math.round(user.commissionRate * 100)}%</p>
        </div>
        <div className="card px-5 py-4 flex items-center gap-3">
          <div>
            <div className="text-xs text-ink-50">โค้ดแนะนำของคุณ</div>
            <div className="font-mono text-lg text-ink-400">{myReferralCode}</div>
          </div>
          <ReferralCopyButton code={myReferralCode} />
        </div>
      </FadeUp>

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Users className="size-4" />} label="คนสมัครจากโค้ดคุณ" value={fmtNum(referralEnrolls.length)} />
        <Stat icon={<PlayCircle className="size-4" />} label="ยอดชมคลิปคุณ" value={fmtNum(totalViews)} />
        <Stat icon={<TrendingUp className="size-4" />} label="คอร์สที่คุณเรียน" value={fmtNum(myEnrollments.length)} />
        <Stat icon={<Wallet className="size-4" />} label="รายได้สะสม" value={thb(user.earnings)} accent />
      </Stagger>

      <div className="grid lg:grid-cols-2 gap-5">
        <FadeUp className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-ink-400">สมัครผ่านโค้ดคุณ (7 วัน)</h3>
            <span className="text-xs text-ink-50">รวม {referralEnrolls.length}</span>
          </div>
          <TrendChart data={signupTrend} color="#D97757" />
        </FadeUp>
        <FadeUp className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-ink-400">ยอดชมคลิป (7 วัน)</h3>
            <span className="text-xs text-ink-50">รวม {totalViews}</span>
          </div>
          <TrendChart data={viewTrend} color="#262625" />
        </FadeUp>
      </div>

      <FadeUp>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-2xl text-ink-400">คลิปของฉัน</h3>
          <Link href="/upload" className="btn-outline text-sm">+ อัปโหลดใหม่</Link>
        </div>
        {myVideos.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-ink-100">ยังไม่มีคลิป — <Link href="/upload" className="text-coral-500 hover:underline">อัปโหลดคลิปแรก</Link></p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {myVideos.map((v) => (
              <div key={v.id} className="card p-4">
                <div className="aspect-video rounded-lg bg-cream-200 grain mb-3" />
                <h4 className="font-medium text-ink-300 text-sm line-clamp-2">{v.title}</h4>
                <div className="flex items-center justify-between text-xs text-ink-50 mt-2">
                  <span>{fmtNum(v.views)} views</span>
                  <span>{new Date(v.createdAt).toLocaleDateString("th-TH")}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {v.autoTags.slice(0, 4).map((t) => (
                    <span key={t} className="pill text-[10px]">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </FadeUp>

      <FadeUp>
        <h3 className="font-serif text-2xl text-ink-400 mb-3">รายการคอร์สที่สมัคร</h3>
        {myEnrollments.length === 0 ? (
          <div className="card p-10 text-center text-ink-100">ยังไม่ได้สมัครคอร์สใด — <Link href="/courses" className="text-coral-500 hover:underline">เลือกเลย</Link></div>
        ) : (
          <ul className="card divide-y divide-cream-300">
            {myEnrollments.map((e) => {
              const c = db.courses.find((x) => x.id === e.courseId);
              return (
                <li key={e.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-ink-300">{c?.titleTh ?? e.courseId}</div>
                    <div className="text-xs text-ink-50">สมัครเมื่อ {new Date(e.createdAt).toLocaleDateString("th-TH")}</div>
                  </div>
                  <span className="font-mono text-sm">{thb(e.amount)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </FadeUp>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <StaggerItem className={`stat-card ${accent ? "bg-coral-50 border-coral-200" : ""}`}>
      <div className="flex items-center gap-2 text-ink-100 text-xs">{icon} {label}</div>
      <div className="font-serif text-3xl text-ink-400">{value}</div>
    </StaggerItem>
  );
}
