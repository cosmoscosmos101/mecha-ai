import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { update } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const { id } = await params;
  const patch = await req.json().catch(() => ({}));
  await update((db) => {
    const u = db.users.find((x) => x.id === id);
    if (!u) return;
    if (typeof patch.role === "string" && ["student","tutor","admin"].includes(patch.role))
      u.role = patch.role;
    if (typeof patch.commissionRate === "number")
      u.commissionRate = Math.max(0, Math.min(1, patch.commissionRate));
    if (typeof patch.name === "string") u.name = patch.name;
  });
  return NextResponse.json({ ok: true });
}
