import { read } from "@/lib/db";
import { CourseCard } from "@/components/course-card";
import { Stagger, StaggerItem, FadeUp } from "@/components/motion-primitives";
import { CourseFilters } from "@/components/course-filters";
import type { Discipline } from "@/lib/types";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const all = (await read()).courses;
  const disc = sp.d as Discipline | undefined;
  const q = (sp.q ?? "").toLowerCase().trim();

  const filtered = all.filter((c) => {
    if (disc && c.discipline !== disc) return false;
    if (q && !`${c.title} ${c.titleTh} ${c.summary} ${c.topics.join(" ")}`.toLowerCase().includes(q))
      return false;
    return true;
  });

  return (
    <div className="container-page py-12">
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">หลักสูตรทั้งหมด</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink-400 mb-2">เลือกสาขาที่ใช่</h1>
        <p className="text-ink-100 max-w-2xl">
          {filtered.length} คอร์ส • โครงสร้างหลักสูตรอ้างอิงจาก odm-engineer.com
        </p>
      </FadeUp>

      <div className="mt-8">
        <CourseFilters />
      </div>

      <Stagger className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <StaggerItem key={c.id}>
            <CourseCard course={c} />
          </StaggerItem>
        ))}
      </Stagger>

      {filtered.length === 0 && (
        <div className="mt-16 text-center text-ink-100">
          <p className="font-serif text-2xl text-ink-300">ไม่พบคอร์สที่ตรงเงื่อนไข</p>
          <p className="text-sm mt-2">ลองล้างฟิลเตอร์หรือเปลี่ยนคำค้น</p>
        </div>
      )}
    </div>
  );
}
