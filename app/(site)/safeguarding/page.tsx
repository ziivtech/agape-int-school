import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Safeguarding" };

export default function SafeguardingPage() {
  return <PolicyPage sectionKey="legal.safeguarding" />;
}
