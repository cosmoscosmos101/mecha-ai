import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { read } from "@/lib/db";
import { recommend } from "@/lib/ml";

export async function GET() {
  const session = await getSession();
  const db = await read();
  const userViews = session ? db.views.filter((v) => v.userId === session.sub) : [];
  const recs = recommend(db.courses, userViews, db.videos, 6);
  return NextResponse.json({
    items: recs.map((c) => ({ id: c.id, slug: c.slug, titleTh: c.titleTh, rating: c.rating })),
  });
}
