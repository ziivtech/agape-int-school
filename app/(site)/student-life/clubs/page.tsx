import type { Metadata } from "next";
import StudentLifeSubpage from "@/components/StudentLifeSubpage";

export const metadata: Metadata = {
  title: "Clubs",
  description:
    "Discover clubs and student interests at Agape Academy International, where students explore curiosity, creativity, leadership and collaboration beyond the classroom.",
};

export default function ClubsPage() {
  return <StudentLifeSubpage sectionKey="studentLife.clubs" />;
}
