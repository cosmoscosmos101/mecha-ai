import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail, checkPassword, sign, setSessionCookie } from "@/lib/auth";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  const user = await findUserByEmail(parsed.data.email);
  if (!user) return NextResponse.json({ error: "ไม่พบอีเมลนี้" }, { status: 404 });
  const ok = await checkPassword(user, parsed.data.password);
  if (!ok) return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  const token = await sign({ sub: user.id, role: user.role, name: user.name });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, role: user.role });
}
