import { NextResponse } from "next/server";
import path from "node:path";
import { getSession } from "@/lib/auth";
import { read, update, uid } from "@/lib/db";
import { autoTag } from "@/lib/ml";
import { saveFile } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_BYTES = 200 * 1024 * 1024; // 200MB

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const courseId = String(form.get("courseId") ?? "").trim();
  if (!(file instanceof File) || !title || !courseId)
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: "ไฟล์ใหญ่เกิน 200MB" }, { status: 413 });
  if (!file.type.startsWith("video/"))
    return NextResponse.json({ error: "รับเฉพาะไฟล์วิดีโอ" }, { status: 415 });

  const ext = path.extname(file.name) || ".mp4";
  const safeId = uid("v");
  const key = `${safeId}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const stored = await saveFile(key, buf);

  const tags = autoTag(`${title} ${description}`);
  const db = await read();
  const course = db.courses.find((c) => c.id === courseId);
  const uploader = db.users.find((u) => u.id === session.sub);

  await update((d) => {
    d.videos.push({
      id: safeId,
      title,
      description,
      courseId,
      uploaderId: session.sub,
      uploaderName: uploader?.name ?? session.name,
      filename: stored.url,
      size: file.size,
      mimeType: file.type,
      views: 0,
      likes: 0,
      autoTags: tags,
      createdAt: new Date().toISOString(),
    });
  });

  return NextResponse.json({
    ok: true,
    video: { id: safeId, autoTags: tags, course: course?.titleTh },
  });
}
