import { NextResponse } from "next/server";
import { autoTag } from "@/lib/ml";

export async function POST(req: Request) {
  const { text } = await req.json().catch(() => ({ text: "" }));
  return NextResponse.json({ tags: autoTag(String(text ?? "")) });
}
