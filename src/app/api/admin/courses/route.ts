import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { update, uid } from "@/lib/db";
import { embed } from "@/lib/ml";
import { thb, fmtNum } from "@/lib/utils";

const Schema = z.object({
  titleTh: z.string().min(1),
  title: z.string().min(1),
  discipline: z.enum(["mechanical","civil","electrical","industrial","design","theory"]),
  level: z.enum(["intro","intermediate","advanced"]),
  price: z.number().int().min(0),
  hours: z.number().int().min(1),
  topics: z.array(z.string()),
  summary: z.string().optional(),
});

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  const p = Schema.safeParse(body);
  if (!p.success) return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  const id = uid(p.data.discipline.slice(0, 2).toUpperCase());
  const slug = p.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const course = await update((db) => {
    const c = {
      id,
      slug,
      ...p.data,
      summary: p.data.summary ?? "",
      thumbnail: "/img/courses/default.svg",
      enrolled: 0,
      rating: 5.0,
      embedding: embed(p.data.topics),
    };
    db.courses.push(c);
    return c;
  });
  return NextResponse.json({
    ok: true,
    row: {
      id: course.id,
      slug: course.slug,
      titleTh: course.titleTh,
      discipline: course.discipline,
      price: course.price,
      priceFmt: thb(course.price),
      enrolled: 0,
      enrolledFmt: fmtNum(0),
      rating: course.rating,
    },
  });
}
