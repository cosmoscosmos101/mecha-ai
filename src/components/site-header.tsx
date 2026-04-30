import Link from "next/link";
import { getSession } from "@/lib/auth";
import { HeaderNav } from "./header-nav";

export async function SiteHeader() {
  const session = await getSession();
  return (
    <header className="sticky top-0 z-40 border-b border-cream-300/70 bg-cream-200/70 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-coral-400 text-white font-serif text-lg leading-none transition group-hover:rotate-[-6deg]">
            M
          </span>
          <span className="font-serif text-xl text-ink-400">Mecha<span className="text-coral-400">.</span>AI</span>
        </Link>
        <HeaderNav session={session} />
      </div>
    </header>
  );
}
