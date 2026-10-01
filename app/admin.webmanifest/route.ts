// Web app manifest for the staff admin, so it can be installed as an app.
// Served outside /admin so the sign-in check in middleware doesn't block it.

const manifest = {
  id: "/admin",
  name: "Agape Academy Admin",
  short_name: "Agape Admin",
  description: "Enquiries, website content, news and events for Agape Academy International.",
  start_url: "/admin?source=pwa",
  scope: "/admin",
  display: "standalone",
  orientation: "any",
  background_color: "#F6F4F7",
  theme_color: "#6C0798",
  categories: ["education", "productivity", "business"],
  icons: [
    { src: "/admin-app/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/admin-app/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/admin-app/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    { src: "/admin-app/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
  shortcuts: [
    { name: "Enquiries", short_name: "Enquiries", url: "/admin/enquiries", icons: [{ src: "/admin-app/icon-96.png", sizes: "96x96" }] },
    { name: "New enquiries", short_name: "New", url: "/admin/enquiries?status=new", icons: [{ src: "/admin-app/icon-96.png", sizes: "96x96" }] },
    { name: "Write a news story", short_name: "New story", url: "/admin/news/new", icons: [{ src: "/admin-app/icon-96.png", sizes: "96x96" }] },
    { name: "Events", short_name: "Events", url: "/admin/events", icons: [{ src: "/admin-app/icon-96.png", sizes: "96x96" }] },
  ],
};

export function GET() {
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json", "Cache-Control": "public, max-age=3600" },
  });
}
