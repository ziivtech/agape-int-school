import type { Metadata } from "next";
import StudentLifeSubpage from "@/components/StudentLifeSubpage";

export const metadata: Metadata = {
  title: "Trips & Experiences",
  description:
    "Discover educational trips, excursions and experiential learning opportunities at Agape Academy International.",
};

export default function TripsPage() {
  return <StudentLifeSubpage sectionKey="studentLife.trips" />;
}
