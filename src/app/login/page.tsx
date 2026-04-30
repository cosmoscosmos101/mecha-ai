import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="container-page py-20 max-w-md">
      <p className="text-xs uppercase tracking-widest text-coral-400 mb-2">เข้าสู่ระบบ</p>
      <h1 className="font-serif text-4xl text-ink-400 mb-2">ยินดีต้อนรับกลับ</h1>
      <p className="text-ink-100 mb-8 text-sm">
        ลองบัญชีตัวอย่าง: <code className="font-mono text-ink-300">tutor@mecha.ai / tutor1234</code> หรือ
        <code className="font-mono text-ink-300"> admin@mecha.ai / admin1234</code>
      </p>
      <LoginForm next={next} />
      <p className="text-sm text-ink-100 mt-6 text-center">
        ยังไม่มีบัญชี? <Link href="/signup" className="text-coral-500 hover:underline">สมัครเลย</Link>
      </p>
    </div>
  );
}
