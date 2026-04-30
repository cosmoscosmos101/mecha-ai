import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!url) {
  throw new Error("DATABASE_URL not set. Run `vercel env pull .env.local` first.");
}

export default {
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
} satisfies Config;
