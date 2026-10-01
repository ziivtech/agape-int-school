"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

/** Registers the admin service worker. Rendered once in the admin layout. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin" }).catch((err) => console.error("Service worker failed", err));
  }, []);
  return null;
}

/** Shows the number of new enquiries on the installed app's icon (where supported). */
export function AppBadge({ count }: { count: number }) {
  useEffect(() => {
    const nav = navigator as Navigator & { setAppBadge?: (n?: number) => Promise<void>; clearAppBadge?: () => Promise<void> };
    if (!nav.setAppBadge) return;
    (count > 0 ? nav.setAppBadge(count) : nav.clearAppBadge?.())?.catch(() => {});
  }, [count]);
  return null;
}

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);

/**
 * "Install app" link for the sidebar. Uses the browser's install prompt on
 * Android/Chrome/Edge, and explains "Add to Home Screen" on iPhone/iPad.
 */
export function InstallAppButton() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(true);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    const ua = navigator.userAgent;
    setIos(/iphone|ipad|ipod/i.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!prompt && !ios)) return null;

  return (
    <>
      <button
        onClick={async () => {
          if (prompt) {
            await prompt.prompt();
            await prompt.userChoice;
            setPrompt(null);
          } else {
            setShowIosHelp(true);
          }
        }}
        className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#6C0798]/25 bg-[#6C0798]/5 px-3 py-2 font-sans text-xs font-medium text-[#6C0798] hover:bg-[#6C0798]/10"
      >
        <Download size={13} /> Install as an app
      </button>

      {showIosHelp && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center bg-[#19151C]/50 p-4 sm:items-center" onClick={() => setShowIosHelp(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 font-sans" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="font-serif text-2xl">Install on iPhone</h2>
              <button onClick={() => setShowIosHelp(false)} aria-label="Close" className="rounded p-1 text-[#19151C]/50">
                <X size={18} />
              </button>
            </div>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-[#19151C]/75">
              <li>
                1. Open this page in <b>Safari</b>.
              </li>
              <li className="flex flex-wrap items-center gap-1">
                2. Tap the Share button <Share size={15} className="inline text-[#0A84FF]" /> at the bottom of the screen.
              </li>
              <li>
                3. Scroll down and tap <b>Add to Home Screen</b>, then <b>Add</b>.
              </li>
            </ol>
            <p className="mt-4 text-xs text-[#19151C]/50">The Agape Admin icon will appear on your home screen and open full-screen like an app.</p>
          </div>
        </div>
      )}
    </>
  );
}
