import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "./db";
import * as schema from "./schema";
import { uid } from "./db";
import type { User } from "./types";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-secret-change-me-in-prod-please-32+bytes",
);
const COOKIE = "mecha_session";

export interface SessionPayload {
  sub: string;
  role: User["role"];
  name: string;
}

export async function sign(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verify(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;
  return verify(token);
}

export async function setSessionCookie(token: string) {
  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.delete(COOKIE);
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const rows = await db
    .select()
    .from(schema.users)
    .where(sql`lower(${schema.users.email}) = ${email.toLowerCase()}`);
  return rows[0];
}

export async function findUserById(id: string): Promise<User | undefined> {
  const rows = await db.select().from(schema.users).where(eq(schema.users.id, id));
  return rows[0];
}

export async function findUserByReferral(code: string): Promise<User | undefined> {
  if (!code) return undefined;
  const rows = await db
    .select()
    .from(schema.users)
    .where(sql`upper(${schema.users.referralCode}) = ${code.toUpperCase()}`);
  return rows[0];
}

export async function createUser(input: {
  email: string;
  password: string;
  name: string;
  role?: User["role"];
}): Promise<User> {
  const existing = await findUserByEmail(input.email);
  if (existing) throw new Error("EMAIL_TAKEN");
  const passwordHash = await bcrypt.hash(input.password, 10);
  const user: User = {
    id: uid("u"),
    email: input.email,
    name: input.name,
    passwordHash,
    role: input.role ?? "student",
    commissionRate: input.role === "tutor" ? 0.3 : 0.1,
    earnings: 0,
    referralCode:
      input.email.split("@")[0].slice(0, 6).toUpperCase() +
      Math.floor(Math.random() * 90 + 10),
    createdAt: new Date().toISOString(),
  };
  await db.insert(schema.users).values(user);
  return user;
}

export async function checkPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}
