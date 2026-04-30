import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { update, read } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const { id } = await params;
  const v = (await read()).videos.find((x) => x.id === id);
  if (v?.filename) await deleteFile(v.filename);
  await update((db) => {
    db.videos = db.videos.filter((vd) => vd.id !== id);
  });
  return NextResponse.json({ ok: true });
}
