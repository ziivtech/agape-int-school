import type { Metadata } from "next";
import StudentLifeSubpage from "@/components/StudentLifeSubpage";

export const metadata: Metadata = {
  title: "Student Union",
  description:
    "Learn about the Student Union at Agape Academy International and opportunities for students to represent, organise and contribute to school life.",
};

export default function StudentUnionPage() {
  return <StudentLifeSubpage sectionKey="studentLife.studentUnion" />;
}
