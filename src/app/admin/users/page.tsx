import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { read } from "@/lib/db";
import { UserAdminTable } from "@/components/admin-tables";

export default async function AdminUsers() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");
  const users = (await read()).users;
  return (
    <div className="container-page py-12 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">Admin / Users</p>
        <h1 className="font-serif text-4xl text-ink-400">จัดการผู้ใช้</h1>
      </div>
      <UserAdminTable
        rows={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          referralCode: u.referralCode,
          commissionRate: u.commissionRate,
          earnings: u.earnings,
        }))}
      />
    </div>
  );
}
