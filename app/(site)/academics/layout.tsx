import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academics",
  description: "Early Years to High School at Agape Academy International: the Abeka curriculum, learning support and university pathways.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
