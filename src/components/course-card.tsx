import Link from "next/link";
import { Star, Users, Clock } from "lucide-react";
import type { Course } from "@/lib/types";
import { thb, fmtNum } from "@/lib/utils";

const disciplineColors: Record<Course["discipline"], string> = {
  mechanical: "bg-coral-400/10 text-coral-500 border-coral-200",
  civil: "bg-emerald-100/60 text-emerald-700 border-emerald-200",
  electrical: "bg-amber-100/60 text-amber-700 border-amber-200",
  industrial: "bg-violet-100/60 text-violet-700 border-violet-200",
  design: "bg-rose-100/60 text-rose-700 border-rose-200",
  theory: "bg-sky-100/60 text-sky-700 border-sky-200",
};

const disciplineLabel: Record<Course["discipline"], string> = {
  mechanical: "เครื่องกล",
  civil: "โยธา",
  electrical: "ไฟฟ้า",
  industrial: "อุตสาหการ",
  design: "ออกแบบ",
  theory: "ทฤษฎี",
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="card p-5 flex flex-col gap-4 group">
      <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-cream-200 to-cream-300 grain relative overflow-hidden">
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-serif text-5xl text-ink-200/40">{course.id.split("-")[0]}</span>
        </div>
        <span className={`absolute top-3 left-3 pill border ${disciplineColors[course.discipline]}`}>
          {disciplineLabel[course.discipline]}
        </span>
      </div>
      <div>
        <h3 className="font-serif text-xl text-ink-400 leading-snug group-hover:text-coral-500 transition">
          {course.titleTh}
        </h3>
        <p className="text-xs text-ink-50 mt-1">{course.title}</p>
      </div>
      <p className="text-sm text-ink-100 line-clamp-2">{course.summary}</p>
      <div className="flex items-center gap-4 text-xs text-ink-100 mt-auto pt-3 border-t border-cream-300">
        <span className="flex items-center gap-1"><Star className="size-3.5 fill-coral-400 stroke-coral-400" /> {course.rating}</span>
        <span className="flex items-center gap-1"><Users className="size-3.5" /> {fmtNum(course.enrolled)}</span>
        <span className="flex items-center gap-1"><Clock className="size-3.5" /> {course.hours} ชม.</span>
        <span className="ml-auto font-mono font-medium text-ink-400">{thb(course.price)}</span>
      </div>
    </Link>
  );
}
