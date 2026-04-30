import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { read } from "@/lib/db";
import { thb, fmtNum } from "@/lib/utils";
import { CourseAdminTable } from "@/components/admin-tables";

export default async function AdminCourses() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");
  const courses = (await read()).courses;
  return (
    <div className="container-page py-12 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">Admin / Courses</p>
        <h1 className="font-serif text-4xl text-ink-400">จัดการคอร์ส</h1>
      </div>
      <CourseAdminTable
        rows={courses.map((c) => ({
          id: c.id,
          slug: c.slug,
          titleTh: c.titleTh,
          discipline: c.discipline,
          price: c.price,
          priceFmt: thb(c.price),
          enrolled: c.enrolled,
          enrolledFmt: fmtNum(c.enrolled),
          rating: c.rating,
        }))}
      />
    </div>
  );
}
