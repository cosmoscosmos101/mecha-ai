import { NextResponse } from "next/server";
import { getSession } from "./auth";

export async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "admin")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return null;
}
