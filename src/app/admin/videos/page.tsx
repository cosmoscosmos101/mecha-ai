import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { read } from "@/lib/db";
import { VideoAdminTable } from "@/components/admin-tables";

export default async function AdminVideos() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");
  const db = await read();
  const rows = db.videos.map((v) => ({
    id: v.id,
    title: v.title,
    uploaderName: v.uploaderName,
    course: db.courses.find((c) => c.id === v.courseId)?.titleTh ?? v.courseId,
    autoTags: v.autoTags,
    views: v.views,
    createdAt: v.createdAt,
  }));
  return (
    <div className="container-page py-12 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">Admin / Videos</p>
        <h1 className="font-serif text-4xl text-ink-400">จัดการคลิป</h1>
      </div>
      <VideoAdminTable rows={rows} />
    </div>
  );
}
