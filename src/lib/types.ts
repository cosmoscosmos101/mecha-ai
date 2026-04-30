export type Discipline =
  | "mechanical"
  | "civil"
  | "electrical"
  | "industrial"
  | "design"
  | "theory";

export interface Course {
  id: string;
  slug: string;
  title: string;
  titleTh: string;
  discipline: Discipline;
  level: "intro" | "intermediate" | "advanced";
  hours: number;
  price: number;
  summary: string;
  topics: string[];
  thumbnail: string;
  enrolled: number;
  rating: number;
  // ML feature vector (auto-derived from topics) — used by recommender
  embedding?: number[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "student" | "tutor" | "admin";
  // commission rate as fraction (e.g. 0.30 = 30%)
  commissionRate: number;
  earnings: number;
  referralCode: string;
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  courseId: string;
  uploaderId: string;
  uploaderName: string;
  filename: string;
  size: number;
  mimeType: string;
  views: number;
  likes: number;
  // ML-generated tags
  autoTags: string[];
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  referralCode?: string;
  amount: number;
  commissionPaid: number;
  createdAt: string;
}

export interface ViewEvent {
  id: string;
  videoId?: string;
  courseId?: string;
  userId?: string;
  ts: string;
}

export interface DB {
  users: User[];
  courses: Course[];
  videos: Video[];
  enrollments: Enrollment[];
  views: ViewEvent[];
}
