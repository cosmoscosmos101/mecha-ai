import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import * as schema from "../src/lib/schema";
import { seedCourses } from "../src/lib/seed";
import { embed } from "../src/lib/ml";
import type { User } from "../src/lib/types";

async function main() {
  const existingUsers = await db.select().from(schema.users);
  const existingCourses = await db.select().from(schema.courses);

  if (existingUsers.length === 0) {
    const now = new Date().toISOString();
    const users: User[] = [
      {
        id: "u-admin",
        email: "admin@mecha.ai",
        name: "Admin",
        passwordHash: bcrypt.hashSync("admin1234", 10),
        role: "admin",
        commissionRate: 0,
        earnings: 0,
        referralCode: "ADMIN",
        createdAt: now,
      },
      {
        id: "u-tutor",
        email: "tutor@mecha.ai",
        name: "ติวเตอร์ตัวอย่าง",
        passwordHash: bcrypt.hashSync("tutor1234", 10),
        role: "tutor",
        commissionRate: 0.3,
        earnings: 0,
        referralCode: "TUTOR1",
        createdAt: now,
      },
    ];
    await db.insert(schema.users).values(users);
    console.log(`✓ seeded ${users.length} users`);
  } else {
    console.log(`• users already seeded (${existingUsers.length})`);
  }

  if (existingCourses.length === 0) {
    const rows = seedCourses.map((c) => ({ ...c, embedding: embed(c.topics) }));
    await db.insert(schema.courses).values(rows);
    console.log(`✓ seeded ${rows.length} courses`);
  } else {
    console.log(`• courses already seeded (${existingCourses.length})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
