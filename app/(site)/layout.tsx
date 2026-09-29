import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { ContentProvider } from "@/components/content/ContentProvider";
import { getSiteContent } from "@/lib/content/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();

  return (
    <ContentProvider content={content}>
      <Preloader logoSrc={content["site.identity"].logo.url} />
      <Navbar />
      {children}
      <Footer />
    </ContentProvider>
  );
}
