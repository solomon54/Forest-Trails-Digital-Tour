// components/InstallPWA.tsx
"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Safe to access window/navigator now (client-side only)

    // Mobile detection: touch device OR small screen (for DevTools)
    const mobileCheck =
      "ontouchstart" in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      window.innerWidth <= 768;

    setIsMobileDevice(mobileCheck);

    const handleBeforeInstall = (e: Event) => {
      const installEvent = e as BeforeInstallPromptEvent;

      if (process.env.NODE_ENV === "development") {
        console.log("🎉 beforeinstallprompt fired!", installEvent);
      }

      e.preventDefault();
      setDeferredPrompt(installEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Hide if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowButton(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      if (process.env.NODE_ENV === "development") {
        console.log("User installed the app!");
      }
      localStorage.setItem("pwa_install_dismissed", "true");
    }

    setShowButton(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowButton(false);
    localStorage.setItem("pwa_install_dismissed", "true");
  };

  // Prevent rendering if not mobile, dismissed, or already installed
  const wasDismissed =
    typeof window !== "undefined" &&
    localStorage.getItem("pwa_install_dismissed") === "true";
  const isStandalone =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;

  if (!showButton || !isMobileDevice || wasDismissed || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 animate-fade-in pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {/* Tooltip */}
        <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg opacity-95 mb-2">
          Add to Home Screen for quick access 🌿
        </div>

        {/* Install Button */}
        <button
          onClick={handleInstall}
          className="bg-[#2d5e3a] hover:bg-[#1e4028] text-white rounded-full px-5 py-4 shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center gap-3 font-medium"
          aria-label="Install Forest·Trails App">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Install App</span>
        </button>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-700 text-sm mt-1"
          aria-label="Dismiss install prompt">
          ✕
        </button>
      </div>
    </div>
  );
}
