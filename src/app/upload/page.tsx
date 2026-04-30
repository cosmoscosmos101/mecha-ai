import { read } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { UploadForm } from "@/components/upload-form";
import { redirect } from "next/navigation";
import { FadeUp } from "@/components/motion-primitives";

export default async function UploadPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/upload");
  const courses = (await read()).courses.map((c) => ({
    id: c.id,
    titleTh: c.titleTh,
    discipline: c.discipline,
  }));

  return (
    <div className="container-page py-12 max-w-3xl">
      <FadeUp>
        <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">อัปโหลดคลิปติว</p>
        <h1 className="font-serif text-4xl text-ink-400 mb-2">แบ่งปันความรู้ของคุณ</h1>
        <p className="text-ink-100 mb-8 text-sm leading-relaxed">
          อัปโหลดวิดีโอ ระบบจะ auto-tag เนื้อหาด้วย ML และจัดเข้าเส้นทางการเรียนรู้ที่เหมาะสม —
          ผู้ชมจะค้นพบคลิปของคุณผ่าน recommendation engine
        </p>
      </FadeUp>
      <UploadForm courses={courses} />
    </div>
  );
}
