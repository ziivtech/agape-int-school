import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Our story, mission, values and leadership at Agape Academy International, a Christ-centred school in Ghana.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
