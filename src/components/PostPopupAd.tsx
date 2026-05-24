"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type PopupAd = {
  id: number;
  title: string;
  image: string;
  targetUrl: string;
  delaySeconds: number;
};

const wpSiteUrl =
  process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "";

const POPUP_REPEAT_MS = 3 * 60 * 1000; // 3 minutes

function buildWpSiteUrl(path: string): string {
  const base = wpSiteUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export default function PostPopupAd() {
  const pathname = usePathname();

  const [ad, setAd] = useState<PopupAd | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const firstShowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Re-fetch a random ad from the API (cache-busted so WordPress returns a fresh random pick)
  const fetchNewAd = useCallback(async (): Promise<PopupAd | null> => {
    try {
      const res = await fetch(
        buildWpSiteUrl("/wp-json/vd7/v1/popup-ad"),
        { cache: "no-store" }
      );

      if (!res.ok) return null;

      const data: PopupAd | null = await res.json();
      if (!data || !data.image) return null;

      return data;
    } catch (error) {
      console.error("Popup ad fetch error:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!wpSiteUrl) {
      console.error(
        "NEXT_PUBLIC_WORDPRESS_SITE_URL or NEXT_PUBLIC_SITE_URL is not defined"
      );
      return;
    }

    if (firstShowTimerRef.current) {
      clearTimeout(firstShowTimerRef.current);
      firstShowTimerRef.current = null;
    }

    if (repeatTimerRef.current) {
      clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }

    isClosingRef.current = false;
    setVisible(false);

    const initAd = async () => {
      const data = await fetchNewAd();

      if (!data) {
        setAd(null);
        return;
      }

      setAd(data);

      firstShowTimerRef.current = setTimeout(() => {
        if (!isClosingRef.current) {
          setVisible(true);
        }
      }, (data.delaySeconds || 4) * 1000);
    };

    initAd();

    return () => {
      if (firstShowTimerRef.current) {
        clearTimeout(firstShowTimerRef.current);
        firstShowTimerRef.current = null;
      }

      if (repeatTimerRef.current) {
        clearTimeout(repeatTimerRef.current);
        repeatTimerRef.current = null;
      }
    };
  }, [pathname, fetchNewAd]);

  const scheduleNextPopup = useCallback(() => {
    if (repeatTimerRef.current) {
      clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }

    repeatTimerRef.current = setTimeout(async () => {
      // Re-fetch a new random ad from the API for each repeat cycle
      const newAd = await fetchNewAd();
      if (newAd) {
        setAd(newAd);
      }
      isClosingRef.current = false;
      setVisible(true);
    }, POPUP_REPEAT_MS);
  }, [fetchNewAd]);

  const closePopup = useCallback(() => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;
    setVisible(false);
    scheduleNextPopup();
  }, [scheduleNextPopup]);

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  if (!mounted || !ad) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 transition-all duration-300 ${visible
          ? "pointer-events-auto bg-black/60 opacity-100"
          : "pointer-events-none bg-black/0 opacity-0"
        }`}
      aria-hidden={!visible}
      inert={!visible || undefined}
      onClick={closePopup}
    >
      <div
        className={`relative w-full max-w-[400px] sm:max-w-[460px] transition-all duration-500 ${visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-6 scale-95 opacity-0"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <button
            type="button"
            onClick={closePopup}
            className="absolute right-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-red-500 hover:bg-red-600 active:scale-95 active:border-red-500 active:bg-red-600"
            aria-label="Close popup"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          </button>

          <Link
            href={ad.targetUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
          >
            <img
              src={ad.image}
              alt={ad.title}
              className="block max-h-[82vh] w-full object-cover transition-transform duration-300 group-hover:scale-[1.01] group-active:scale-[0.99]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}