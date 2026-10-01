import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/admin/PwaSupport";

export const metadata: Metadata = {
  title: "Staff admin",
  robots: { index: false, follow: false },
  manifest: "/admin.webmanifest",
  applicationName: "Agape Admin",
  appleWebApp: { capable: true, title: "Agape Admin", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/admin-app/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/admin-app/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#6C0798",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PwaRegister />
      {children}
    </>
  );
}
