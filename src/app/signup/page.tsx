import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; ref?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="container-page py-20 max-w-md">
      <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">สมัครสมาชิก</p>
      <h1 className="font-serif text-4xl text-ink-400 mb-2">เริ่มต้นที่นี่</h1>
      <p className="text-ink-100 mb-8 text-sm">
        สมัครสมาชิกฟรี — เข้าเรียน อัปโหลดคลิป และรับคอมมิชชั่นจากการแนะนำ
      </p>
      <SignupForm defaultRole={sp.role} referral={sp.ref} />
      <p className="text-sm text-ink-100 mt-6 text-center">
        มีบัญชีแล้ว? <Link href="/login" className="text-coral-500 hover:underline">เข้าสู่ระบบ</Link>
      </p>
    </div>
  );
}
