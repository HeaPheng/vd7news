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
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Measure the full height of the ad content
  useEffect(() => {
    if (!contentRef.current) return;

    const measure = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    measure();

    // Re-measure when image loads
    const img = contentRef.current.querySelector("img");
    if (img) {
      img.addEventListener("load", measure);
      return () => img.removeEventListener("load", measure);
    }
  }, [ad.image]);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      if (!sentinelRef.current) return;

      const rect = sentinelRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Start revealing when sentinel top enters the bottom 20% of viewport
      // Fully revealed when sentinel top reaches 55% from top of viewport
      const startPoint = viewportHeight * 0.9;
      const endPoint = viewportHeight * 0.45;

      if (rect.top >= startPoint) {
        setProgress(0);
      } else if (rect.top <= endPoint) {
        setProgress(1);
      } else {
        const p = (startPoint - rect.top) / (startPoint - endPoint);
        setProgress(Math.max(0, Math.min(1, p)));
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  if (!ad.image) return null;

  const currentMaxHeight = contentHeight > 0 ? progress * contentHeight : 0;
  const eased = progress * progress * (3 - 2 * progress); // smoothstep

  return (
    <div className="my-6 -mx-3 sm:-mx-8 lg:-mx-10 md:hidden">
      {/* Sentinel — marks the scroll trigger position */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Reveal container — clips content based on scroll progress */}
      <div
        style={{
          maxHeight: contentHeight > 0 ? `${currentMaxHeight}px` : undefined,
          opacity: eased,
          overflow: "hidden",
          willChange: "max-height, opacity",
        }}
      >
        <div ref={contentRef}>
          <Link
            href={ad.targetUrl || "#"}
            target={ad.openInNewTab ? "_blank" : undefined}
            rel={ad.openInNewTab ? "noopener noreferrer" : undefined}
            className="group relative block overflow-hidden"
          >
            <img
              src={ad.image}
              alt={ad.title}
              className="block w-full object-cover transition-transform duration-300 group-hover:scale-[1.01] group-active:scale-[0.99]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
