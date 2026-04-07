"use client";

import { useEffect, useMemo, useState } from "react";

export type AdItem = {
  id: number;
  title: string;
  placement: "popup" | "article_fixed" | "article_slider";
  image: string;
  targetUrl: string;
  delaySeconds: number | null;
  displayOrder: number;
  openInNewTab: boolean;
};

type Props = {
  sliderAds: AdItem[];
  fixedAd: AdItem | null;
};

function AdBanner({ ad }: { ad: AdItem }) {
  const target = ad.openInNewTab ? "_blank" : "_self";
  const rel = ad.openInNewTab ? "noopener noreferrer" : undefined;

  return (
    <a
      href={ad.targetUrl || "#"}
      target={target}
      rel={rel}
      className="group block h-full w-full overflow-hidden rounded-[18px] border border-white/5 bg-[#0d1424] transition hover:border-red-400/30"
    >
      <div className="relative h-[130px] w-full overflow-hidden bg-[#0d1424] sm:h-[150px] lg:h-[170px]">
        <img
          src={ad.image}
          alt={ad.title}
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </a>
  );
}

export default function ArticleTopAdsClient({ sliderAds, fixedAd }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  const SLIDE_INTERVAL = 3000;
  const TRANSITION_DURATION = 700;

  const loopedAds = useMemo(() => {
    if (sliderAds.length <= 1) return sliderAds;
    return [...sliderAds, sliderAds[0]];
  }, [sliderAds]);

  useEffect(() => {
    if (sliderAds.length <= 1) return;

    const interval = setInterval(() => {
      setEnableTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [sliderAds.length]);

  useEffect(() => {
    if (sliderAds.length <= 1) {
      setCurrentIndex(0);
      setEnableTransition(false);
      return;
    }

    if (currentIndex === sliderAds.length) {
      const timeout = setTimeout(() => {
        setEnableTransition(false);
        setCurrentIndex(0);
      }, TRANSITION_DURATION);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, sliderAds.length]);

  useEffect(() => {
    if (!enableTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
        });
      });

      return () => cancelAnimationFrame(raf);
    }
  }, [enableTransition]);

  if (sliderAds.length === 0 && !fixedAd) return null;

  return (
    <section className="mb-5 space-y-3">
      {sliderAds.length > 0 && (
        <div className="overflow-hidden rounded-[20px] border border-white/5 bg-[#10182b] p-2 shadow-lg">
          <div className="relative h-[130px] w-full overflow-hidden sm:h-[150px] lg:h-[170px]">
            <div
              className="flex h-full"
              style={{
                width: `${loopedAds.length * 100}%`,
                transform: `translateX(-${currentIndex * (100 / loopedAds.length)}%)`,
                transition: enableTransition
                  ? `transform ${TRANSITION_DURATION}ms ease-in-out`
                  : "none",
              }}
            >
              {loopedAds.map((ad, index) => (
                <div
                  key={`${ad.id}-${index}`}
                  className="h-full flex-shrink-0"
                  style={{ width: `${100 / loopedAds.length}%` }}
                >
                  <AdBanner ad={ad} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {fixedAd && (
        <div className="overflow-hidden rounded-[20px] border border-white/5 bg-[#10182b] p-2 shadow-lg">
          <AdBanner ad={fixedAd} />
        </div>
      )}
    </section>
  );
}