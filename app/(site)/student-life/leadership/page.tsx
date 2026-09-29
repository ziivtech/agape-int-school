import type { Metadata } from "next";
import StudentLifeSubpage from "@/components/StudentLifeSubpage";

export const metadata: Metadata = {
  title: "Student Leadership",
  description:
    "Discover student leadership opportunities at Agape Academy International and how responsibility, service and character are developed through school life.",
};

export default function LeadershipPage() {
  return <StudentLifeSubpage sectionKey="studentLife.leadership" />;
}
