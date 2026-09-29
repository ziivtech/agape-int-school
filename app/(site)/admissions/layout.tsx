import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admissions",
  description: "How to apply to Agape Academy International: requirements, fees, scholarships, international families and campus visits.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
