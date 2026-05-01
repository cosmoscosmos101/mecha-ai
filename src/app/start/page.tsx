import type { Metadata } from "next";
import { HowItWorks } from "@/components/how-it-works";

export const metadata: Metadata = {
  title: "เริ่มต้น — Mecha.AI",
  description: "4 ขั้นตอนตั้งแต่เปิดเว็บ จนเริ่มเรียนได้จริง",
};

export default function StartPage() {
  return <HowItWorks />;
}
