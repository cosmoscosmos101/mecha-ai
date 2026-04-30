import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, findUserByReferral } from "@/lib/auth";
import { read, update, uid } from "@/lib/db";

const Schema = z.object({
  courseId: z.string(),
  referral: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  const db = await read();
  const course = db.courses.find((c) => c.id === parsed.data.courseId);
  if (!course) return NextResponse.json({ error: "ไม่พบคอร์ส" }, { status: 404 });

  const already = db.enrollments.find(
    (e) => e.userId === session.sub && e.courseId === course.id
  );
  if (already) return NextResponse.json({ error: "สมัครคอร์สนี้แล้ว" }, { status: 409 });

  const refUser = parsed.data.referral ? await findUserByReferral(parsed.data.referral) : undefined;
  const commission = refUser && refUser.id !== session.sub
    ? Math.round(course.price * refUser.commissionRate)
    : 0;

  await update((d) => {
    d.enrollments.push({
      id: uid("e"),
      userId: session.sub,
      courseId: course.id,
      referralCode: refUser?.referralCode,
      amount: course.price,
      commissionPaid: commission,
      createdAt: new Date().toISOString(),
    });
    const c = d.courses.find((x) => x.id === course.id);
    if (c) c.enrolled += 1;
    if (refUser) {
      const u = d.users.find((x) => x.id === refUser.id);
      if (u) u.earnings += commission;
    }
  });

  return NextResponse.json({ ok: true, commission });
}
