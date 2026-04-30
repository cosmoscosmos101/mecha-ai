import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { update, uid } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getSession();
  const { videoId, courseId } = await req.json().catch(() => ({}));
  await update((d) => {
    d.views.push({
      id: uid("vw"),
      videoId,
      courseId,
      userId: session?.sub,
      ts: new Date().toISOString(),
    });
    if (videoId) {
      const v = d.videos.find((x) => x.id === videoId);
      if (v) v.views += 1;
    }
  });
  return NextResponse.json({ ok: true });
}
