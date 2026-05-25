"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type InlineAdData = {
  id: number;
  title: string;
  image: string;
  targetUrl: string;
  openInNewTab: boolean;
};

type Props = {
  ad: InlineAdData;
};

export default function ArticleInlineAdClient({ ad }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      if (!sentinelRef.current) return;

      const rect = sentinelRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // ── Entry zone (bottom of viewport) ──
      const entryStart = vh * 0.95;
      const entryEnd = vh * 0.55;

      // ── Exit zone (top of viewport) ──
      const exitStart = vh * 0.3;
      const exitEnd = vh * -0.1;

      let p: number;

      if (rect.top >= entryStart) {
        p = 0;
      } else if (rect.top > entryEnd) {
        // Entering from bottom — revealing
        p = (entryStart - rect.top) / (entryStart - entryEnd);
      } else if (rect.top > exitStart) {
        // Middle zone — fully visible
        p = 1;
      } else if (rect.top > exitEnd) {
        // Exiting from top — collapsing
        p = (rect.top - exitEnd) / (exitStart - exitEnd);
      } else {
        p = 0;
      }

      setProgress(Math.max(0, Math.min(1, p)));
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  if (!ad.image) return null;

  // Smoothstep easing for natural feel
  const eased = progress * progress * (3 - 2 * progress);

  // clip-path reveals from top down, collapses from bottom up
  const clipBottom = (1 - eased) * 100;

  return (
    <div ref={sentinelRef} className="my-6 -mx-3 sm:-mx-8 lg:-mx-10 md:hidden">
      <div
        style={{
          clipPath: `inset(0 0 ${clipBottom}% 0)`,
          opacity: eased,
          transition: "clip-path 0.05s linear, opacity 0.05s linear",
          willChange: "clip-path, opacity",
        }}
      >
        <Link
          href={ad.targetUrl || "#"}
          target={ad.openInNewTab ? "_blank" : undefined}
          rel={ad.openInNewTab ? "noopener noreferrer" : undefined}
          className="group relative block overflow-hidden"
        >
          <img
            src={ad.image}
            alt={ad.title}
            className="block w-full object-cover"
          />
        </Link>
      </div>
    </div>
  );
}
