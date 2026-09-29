import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni",
  description: "The Agape Academy International alumni community — stay connected with the school.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
