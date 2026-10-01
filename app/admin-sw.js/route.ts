// Service worker for the installed staff admin.
//
// Deliberately cautious: admin pages and API responses contain enquiry data,
// so they are NEVER stored on the device. Only the app's static files (JS, CSS,
// fonts, icons) are cached, which makes it open quickly. If the network is
// down, staff see a friendly offline screen instead of the browser's error page.

const VERSION = "v1";

const sw = `
const STATIC_CACHE = "agape-admin-static-${VERSION}";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("agape-admin-") && k !== STATIC_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const OFFLINE_HTML = \`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#6C0798">
<title>Offline · Agape Admin</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F6F4F7;color:#19151C;
       font-family:system-ui,-apple-system,"Segoe UI",sans-serif;padding:24px;text-align:center}
  img{width:72px;height:72px} h1{font-family:Georgia,serif;font-weight:400;font-size:28px;margin:20px 0 8px}
  p{color:#19151C99;max-width:320px;line-height:1.5;margin:0 auto}
  button{margin-top:24px;background:#6C0798;color:#fff;border:0;border-radius:999px;padding:12px 22px;font-size:15px;cursor:pointer}
</style></head><body><main>
<img src="/admin-app/icon-192.png" alt="">
<h1>You're offline</h1>
<p>Check your internet connection. Enquiries and content are only shown when you're online, so nothing private is stored on this device.</p>
<button onclick="location.reload()">Try again</button>
</main><script>addEventListener("online",()=>location.reload())</script></body></html>\`;

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Versioned build files and icons never change: cache-first.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/admin-app/")) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      })
    );
    return;
  }

  // Admin pages: always from the network, offline screen if that fails.
  if (req.mode === "navigate" && url.pathname.startsWith("/admin")) {
    event.respondWith(
      fetch(req).catch(() => new Response(OFFLINE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } }))
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
`;

export function GET() {
  return new Response(sw, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      // The script lives at /admin-sw.js but controls /admin.
      "Service-Worker-Allowed": "/admin",
      "Cache-Control": "no-cache",
    },
  });
}
