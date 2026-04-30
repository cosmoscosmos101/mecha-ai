import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { update } from "@/lib/db";
import { embed } from "@/lib/ml";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const { id } = await params;
  const patch = await req.json().catch(() => ({}));
  await update((db) => {
    const c = db.courses.find((x) => x.id === id);
    if (!c) return;
    if (typeof patch.titleTh === "string") c.titleTh = patch.titleTh;
    if (typeof patch.title === "string") c.title = patch.title;
    if (typeof patch.price === "number") c.price = patch.price;
    if (typeof patch.hours === "number") c.hours = patch.hours;
    if (typeof patch.summary === "string") c.summary = patch.summary;
    if (Array.isArray(patch.topics)) {
      c.topics = patch.topics;
      c.embedding = embed(patch.topics);
    }
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const { id } = await params;
  await update((db) => {
    db.courses = db.courses.filter((c) => c.id !== id);
  });
  return NextResponse.json({ ok: true });
}
