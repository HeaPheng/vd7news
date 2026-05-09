"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { buildPostUrl } from "@/lib/utils";

type SlidePost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  date: string;
  author: string;
  categoryName: string;
  categorySlug: string;
};

type HeroSliderProps = {
  posts: SlidePost[];
};

function formatKhmerRelativeDate(dateString: string, nowMs: number) {
  const dateMs = new Date(dateString).getTime();

  if (Number.isNaN(dateMs)) return "";

  const diffMs = nowMs - dateMs;

  if (diffMs < 0) {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  const years = Math.floor(diffMs / year);
  if (years >= 1) return `${years} ឆ្នាំមុន`;

  const months = Math.floor(diffMs / month);
  if (months >= 1) return `${months} ខែមុន`;

  const days = Math.floor(diffMs / day);
  if (days >= 1) return `${days} ថ្ងៃមុន`;

  const hours = Math.floor(diffMs / hour);
  if (hours >= 1) return `${hours} ម៉ោងមុន`;

  const minutes = Math.floor(diffMs / minute);
  if (minutes >= 1) return `${minutes} នាទីមុន`;

  return "មុននេះបន្តិច";
}

export default function HeroSlider({ posts }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [nowMs, setNowMs] = useState(Date.now());
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);
  const [pressedDot, setPressedDot] = useState<number | null>(null);

  useEffect(() => {
    if (!posts.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [posts.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (!posts.length) return null;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + posts.length) % posts.length);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="relative h-[420px]">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {posts.map((post, index) => (
            <div key={post.id} className="relative h-full min-w-full">
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 65vw"
                  priority={index === 0}
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

              <div className="absolute inset-0 flex items-end">
                <div className="w-full p-5 md:p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    {post.categorySlug ? (
                      <Link
                        href={`/category/${post.categorySlug}`}
                        className="inline-flex rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold text-white transition-all duration-150 hover:bg-red-500 active:scale-95 active:bg-red-500"
                        style={{
                          WebkitTapHighlightColor: "rgba(255,255,255,0.16)",
                        }}
                      >
                        {post.categoryName}
                      </Link>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold text-white">
                        {post.categoryName}
                      </span>
                    )}

                    <span className="text-xs text-gray-300">
                      {formatKhmerRelativeDate(post.date, nowMs)} • {post.author}
                    </span>
                  </div>

                  <Link
                    href={buildPostUrl(post.id, post.slug)}
                    className="block"
                    style={{
                      WebkitTapHighlightColor: "rgba(255,255,255,0.16)",
                    }}
                  >
                    <h1 className="mb-3 max-w-3xl text-xl font-extrabold leading-snug text-white transition-all duration-150 hover:text-red-400 active:scale-[0.985] active:text-red-400 md:text-2xl">
                      {post.title}
                    </h1>
                  </Link>

                  <p className="line-clamp-2 max-w-2xl text-sm leading-6 text-gray-200">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={prevSlide}
          onPointerDown={() => setPrevPressed(true)}
          onPointerUp={() => setPrevPressed(false)}
          onPointerLeave={() => setPrevPressed(false)}
          onPointerCancel={() => setPrevPressed(false)}
          className={`absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-all duration-100 hover:border-red-500 hover:text-red-400 ${
            prevPressed
              ? "scale-90 border-red-500 bg-red-600 text-white shadow-[0_0_0_6px_rgba(239,68,68,0.18)]"
              : "scale-100"
          }`}
          aria-label="Previous slide"
          style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.18)" }}
        >
          <span className="text-xl leading-none">‹</span>
        </button>

        <button
          type="button"
          onClick={nextSlide}
          onPointerDown={() => setNextPressed(true)}
          onPointerUp={() => setNextPressed(false)}
          onPointerLeave={() => setNextPressed(false)}
          onPointerCancel={() => setNextPressed(false)}
          className={`absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-all duration-100 hover:border-red-500 hover:text-red-400 ${
            nextPressed
              ? "scale-90 border-red-500 bg-red-600 text-white shadow-[0_0_0_6px_rgba(239,68,68,0.18)]"
              : "scale-100"
          }`}
          aria-label="Next slide"
          style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.18)" }}
        >
          <span className="text-xl leading-none">›</span>
        </button>

        <div className="absolute bottom-4 right-5 flex gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              onPointerDown={() => setPressedDot(index)}
              onPointerUp={() => setPressedDot(null)}
              onPointerLeave={() => setPressedDot(null)}
              onPointerCancel={() => setPressedDot(null)}
              className={`rounded-full transition-all duration-100 ${
                current === index ? "w-8 bg-red-500" : "w-2.5 bg-white/50"
              } ${pressedDot === index ? "scale-125 ring-4 ring-white/20" : "scale-100"} h-2.5`}
              aria-label={`Go to slide ${index + 1}`}
              style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.18)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}