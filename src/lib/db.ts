import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import type { DB } from "./types";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Run `vercel env pull .env.local` to fetch it.");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

const u = <T,>(v: T | null): T | undefined => (v === null ? undefined : v);

export async function read(): Promise<DB> {
  const [usersR, coursesR, videosR, enrollmentsR, viewsR] = await Promise.all([
    db.select().from(schema.users),
    db.select().from(schema.courses),
    db.select().from(schema.videos),
    db.select().from(schema.enrollments),
    db.select().from(schema.views),
  ]);
  return {
    users: usersR,
    courses: coursesR.map((c) => ({ ...c, embedding: u(c.embedding) })),
    videos: videosR,
    enrollments: enrollmentsR.map((e) => ({ ...e, referralCode: u(e.referralCode) })),
    views: viewsR.map((v) => ({
      ...v,
      videoId: u(v.videoId),
      courseId: u(v.courseId),
      userId: u(v.userId),
    })),
  };
}

export async function update<T>(fn: (db: DB) => T): Promise<T> {
  const snap = await read();
  const result = fn(snap);

  // Neon HTTP driver doesn't support multi-statement transactions; we run each
  // table replace as its own statement. Acceptable here because the dataset is
  // small (< few hundred rows) and the JSON-file pattern this preserves only
  // expected single-writer semantics anyway.
  await db.delete(schema.users);
  if (snap.users.length) await db.insert(schema.users).values(snap.users);

  await db.delete(schema.courses);
  if (snap.courses.length) await db.insert(schema.courses).values(snap.courses);

  await db.delete(schema.videos);
  if (snap.videos.length) await db.insert(schema.videos).values(snap.videos);

  await db.delete(schema.enrollments);
  if (snap.enrollments.length) await db.insert(schema.enrollments).values(snap.enrollments);

  await db.delete(schema.views);
  if (snap.views.length) await db.insert(schema.views).values(snap.views);

  return result;
}

export function uid(prefix = "id"): string {
  return `${prefix}-${randomBytes(6).toString("hex")}`;
}
