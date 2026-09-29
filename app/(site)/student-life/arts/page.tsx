import type { Metadata } from "next";
import StudentLifeSubpage from "@/components/StudentLifeSubpage";

export const metadata: Metadata = {
  title: "Arts & Music",
  description:
    "Explore music, drama and visual arts at Agape Academy International and discover how creativity contributes to student development.",
};

export default function ArtsPage() {
  return <StudentLifeSubpage sectionKey="studentLife.arts" />;
}
