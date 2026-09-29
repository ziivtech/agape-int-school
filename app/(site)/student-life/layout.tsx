import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Life",
  description: "Clubs, sport, arts, leadership, trips and the Student Union at Agape Academy International.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
