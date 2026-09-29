import type { Metadata } from "next";
import NewsPageClient from "@/components/NewsPageClient";
import { getPublishedNews } from "@/lib/content/server";
import { toNewsCard } from "@/lib/content/public-types";

export const metadata: Metadata = {
  title: "News & Stories",
  description:
    "Discover the latest academic, student life, faith, sports, arts, community and achievement stories from Agape Academy International.",
};

export default async function NewsPage() {
  const posts = await getPublishedNews();
  return <NewsPageClient articles={posts.map(toNewsCard)} />;
}
