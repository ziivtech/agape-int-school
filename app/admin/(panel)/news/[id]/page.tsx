import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import { NEWS_CATEGORIES } from "@/lib/content/sections/more";
import NewsEditor from "@/components/admin/NewsEditor";

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const session = await requirePageArea("news");

  if (params.id === "new") {
    return <NewsEditor categories={NEWS_CATEGORIES} defaultAuthor={session.name} />;
  }

  const uuid = /^[0-9a-f-]{36}$/i.test(params.id) ? params.id : null;
  if (!uuid) notFound();
  const [post] = await requireDb().select().from(schema.newsPosts).where(eq(schema.newsPosts.id, uuid));
  if (!post) notFound();

  return (
    <NewsEditor
      categories={NEWS_CATEGORIES}
      defaultAuthor={session.name}
      post={{
        id: post.id,
        slug: post.slug,
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        body: post.body,
        coverUrl: post.coverUrl ?? "",
        coverAlt: post.coverAlt ?? "",
        author: post.author ?? "",
        featured: post.featured,
        status: post.status,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : "",
      }}
    />
  );
}
