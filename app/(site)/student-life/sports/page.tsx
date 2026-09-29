import type { Metadata } from "next";
import StudentLifeSubpage from "@/components/StudentLifeSubpage";

export const metadata: Metadata = {
  title: "Sports",
  description:
    "Discover sports and competition at Agape Academy International, where students develop teamwork, discipline, resilience and confidence.",
};

export default function SportsPage() {
  return <StudentLifeSubpage sectionKey="studentLife.sports" />;
}
