import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return <PolicyPage sectionKey="legal.accessibility" />;
}
