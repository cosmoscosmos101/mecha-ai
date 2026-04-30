import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Using system font stacks to avoid network-dependent next/font/google fetches
// during dev. The CSS variables match the rest of the app, so we can swap to
// Inter / Instrument Serif via next/font once an outbound network is reliable:
//   import { Inter, Instrument_Serif } from "next/font/google";
//   const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
//   ...

export const metadata: Metadata = {
  title: "Mecha AI — ติววิศวกรรม ออกแบบ และทฤษฎี",
  description:
    "แพลตฟอร์มเรียน-สอนวิชาวิศวกรรม กลศาสตร์ ออกแบบ และทฤษฎี — มีระบบ commission ให้ผู้สอน",
  metadataBase: new URL("https://mecha.ai"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col font-stack">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
