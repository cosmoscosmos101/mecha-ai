import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser, sign, setSessionCookie, findUserByReferral } from "@/lib/auth";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(["student", "tutor"]).optional(),
  referral: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }
  try {
    const user = await createUser(parsed.data);
    const refUser = parsed.data.referral ? await findUserByReferral(parsed.data.referral) : undefined;
    const token = await sign({ sub: user.id, role: user.role, name: user.name });
    await setSessionCookie(token);
    return NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, role: user.role, referralCode: user.referralCode },
      referredBy: refUser?.id ?? null,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "ERR";
    if (msg === "EMAIL_TAKEN")
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้แล้ว" }, { status: 409 });
    return NextResponse.json({ error: "สมัครไม่สำเร็จ" }, { status: 500 });
  }
}
