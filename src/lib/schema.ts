import { pgTable, text, integer, real, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["student", "tutor", "admin"] }).notNull(),
  commissionRate: real("commission_rate").notNull().default(0),
  earnings: real("earnings").notNull().default(0),
  referralCode: text("referral_code").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleTh: text("title_th").notNull(),
  discipline: text("discipline", {
    enum: ["mechanical", "civil", "electrical", "industrial", "design", "theory"],
  }).notNull(),
  level: text("level", { enum: ["intro", "intermediate", "advanced"] }).notNull(),
  hours: integer("hours").notNull(),
  price: real("price").notNull(),
  summary: text("summary").notNull(),
  topics: jsonb("topics").$type<string[]>().notNull(),
  thumbnail: text("thumbnail").notNull(),
  enrolled: integer("enrolled").notNull().default(0),
  rating: real("rating").notNull().default(0),
  embedding: jsonb("embedding").$type<number[]>(),
});

export const videos = pgTable("videos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  courseId: text("course_id").notNull(),
  uploaderId: text("uploader_id").notNull(),
  uploaderName: text("uploader_name").notNull(),
  filename: text("filename").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  autoTags: jsonb("auto_tags").$type<string[]>().notNull(),
  createdAt: text("created_at").notNull(),
});

export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  courseId: text("course_id").notNull(),
  referralCode: text("referral_code"),
  amount: real("amount").notNull(),
  commissionPaid: real("commission_paid").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const views = pgTable("views", {
  id: text("id").primaryKey(),
  videoId: text("video_id"),
  courseId: text("course_id"),
  userId: text("user_id"),
  ts: text("ts").notNull(),
});
