import { notFound } from "next/navigation";
import Link from "next/link";
import { read } from "@/lib/db";
import { recommend } from "@/lib/ml";
import { getSession } from "@/lib/auth";
import { thb, fmtNum } from "@/lib/utils";
import { CourseCard } from "@/components/course-card";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion-primitives";
import { EnrollButton } from "@/components/enroll-button";
import { Star, Users, Clock, BookOpen, Sparkles } from "lucide-react";

export default async function CourseDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const db = await read();
  const course = db.courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const session = await getSession();
  const userViews = session ? db.views.filter((v) => v.userId === session.sub) : [];
  const recs = recommend(db.courses, userViews, db.videos, 3).filter((c) => c.id !== course.id);
  const videos = db.videos.filter((v) => v.courseId === course.id).slice(0, 6);

  return (
    <div className="container-page py-12">
      <FadeUp className="grid lg:grid-cols-[1fr,360px] gap-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">{course.id}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink-400 leading-tight text-balance">
            {course.titleTh}
          </h1>
          <p className="text-ink-100 mt-2">{course.title}</p>

          <div className="flex gap-5 mt-6 text-sm text-ink-100">
            <span className="flex items-center gap-1.5"><Star className="size-4 fill-coral-400 stroke-coral-400" /> {course.rating}</span>
            <span className="flex items-center gap-1.5"><Users className="size-4" /> {fmtNum(course.enrolled)} ผู้เรียน</span>
            <span className="flex items-center gap-1.5"><Clock className="size-4" /> {course.hours} ชั่วโมง</span>
          </div>

          <p className="mt-6 text-ink-200 leading-relaxed">{course.summary}</p>

          <h2 className="font-serif text-2xl text-ink-400 mt-10 mb-3 flex items-center gap-2">
            <BookOpen className="size-5 text-coral-400" /> เนื้อหาที่จะได้เรียน
          </h2>
          <Stagger className="grid sm:grid-cols-2 gap-2">
            {course.topics.map((t) => (
              <StaggerItem key={t} className="flex items-start gap-2 rounded-lg bg-cream-50 border border-cream-300 px-3 py-2 text-sm text-ink-200">
                <span className="mt-1 size-1.5 rounded-full bg-coral-400 shrink-0" />
                <span className="font-mono text-xs">{t}</span>
              </StaggerItem>
            ))}
          </Stagger>

          {videos.length > 0 && (
            <>
              <h2 className="font-serif text-2xl text-ink-400 mt-10 mb-3">คลิปติวจากชุมชน</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {videos.map((v) => (
                  <div key={v.id} className="card p-4">
                    <div className="aspect-video rounded-lg bg-cream-200 grain mb-3" />
                    <h4 className="font-medium text-ink-300 text-sm line-clamp-2">{v.title}</h4>
                    <p className="text-xs text-ink-50 mt-1">โดย {v.uploaderName} • {fmtNum(v.views)} views</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {v.autoTags.slice(0, 4).map((t) => (
                        <span key={t} className="pill text-[10px]">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="card p-6">
            <div className="font-serif text-3xl text-ink-400">{thb(course.price)}</div>
            <p className="text-xs text-ink-50 mt-1">รวม VAT • เข้าถึงตลอดชีพ</p>
            <EnrollButton courseId={course.id} referral={ref} />
            {!session && (
              <p className="text-xs text-ink-50 mt-3 text-center">
                <Link href={`/login?next=/courses/${course.slug}`} className="text-coral-500 hover:underline">เข้าสู่ระบบ</Link> เพื่อสมัครเรียน
              </p>
            )}
            <div className="border-t border-cream-300 mt-6 pt-4 space-y-2 text-sm text-ink-100">
              <div className="flex justify-between"><span>ระดับ</span><span className="text-ink-300">{course.level}</span></div>
              <div className="flex justify-between"><span>หัวข้อ</span><span className="text-ink-300">{course.topics.length}</span></div>
              <div className="flex justify-between"><span>สาขา</span><span className="text-ink-300">{course.discipline}</span></div>
            </div>
          </div>
        </aside>
      </FadeUp>

      {recs.length > 0 && (
        <section className="mt-20">
          <FadeUp className="flex items-center gap-2 mb-6">
            <Sparkles className="size-4 text-coral-400" />
            <h2 className="font-serif text-2xl text-ink-400">ML แนะนำต่อจากนี้</h2>
          </FadeUp>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {recs.map((c) => (
              <StaggerItem key={c.id}>
                <CourseCard course={c} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
    </div>
  );
}
