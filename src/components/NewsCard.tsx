"use client";

import Link from "next/link";
import { FiClock } from "react-icons/fi";
import { useRef, useState } from "react";

type NewsCardProps = {
  id: string | number;
  title: string;
  image?: string;
  excerpt?: string;
  date?: string;
  author?: string;
  categoryName?: string;
  categorySlug?: string;
  compact?: boolean;
  horizontal?: boolean;
};

function formatDate(dateString?: string) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getRelativeTime(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return "មុននេះបន្តិច";
  if (minutes < 60) return `${minutes} នាទីមុន`;
  if (hours < 24) return `${hours} ម៉ោងមុន`;
  if (days < 30) return `${days} ថ្ងៃមុន`;
  if (months < 12) return `${months} ខែមុន`;
  return `${years} ឆ្នាំមុន`;
}

function renderMeta(date?: string, author?: string, small = false) {
  if (!date && !author) return null;

  return (
    <div
      className={
        small
          ? "flex items-center gap-1.5 text-xs text-gray-400"
          : "flex items-center gap-2 text-sm text-gray-400"
      }
    >
      {date && (
        <>
          <FiClock className="text-gray-500" />
          <span>
            {getRelativeTime(date)} — {formatDate(date)}
          </span>
        </>
      )}
      {author && <span>{date ? " • " : ""}{author}</span>}
    </div>
  );
}

export default function NewsCard({
  id,
  title,
  image,
  excerpt,
  date,
  author,
  categoryName,
  categorySlug,
  compact = false,
  horizontal = false,
}: NewsCardProps) {
  const [pressed, setPressed] = useState(false);
  const releaseTimerRef = useRef<number | null>(null);

  const clearReleaseTimer = () => {
    if (releaseTimerRef.current) {
      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
  };

  const handlePressStart = () => {
    clearReleaseTimer();
    setPressed(true);
  };

  const handlePressEnd = () => {
    clearReleaseTimer();
    releaseTimerRef.current = window.setTimeout(() => {
      setPressed(false);
    }, 150);
  };

  const handlePressCancel = () => {
    clearReleaseTimer();
    setPressed(false);
  };

  const cardBaseClass = `group overflow-hidden border border-white/10 bg-white/5 transition-all duration-150 w-full ${
    pressed
      ? "scale-[0.975] border-red-500/40 bg-white/[0.08] ring-2 ring-red-500/20"
      : "scale-100 hover:border-red-500/40"
  }`;

  const imageClass = `w-full object-cover transition-all duration-200 ${
    pressed ? "scale-[1.03] brightness-110" : "group-hover:scale-105"
  }`;

  const titleClass = `font-bold text-white transition-all duration-150 ${
    pressed ? "text-red-400" : "group-hover:text-red-400"
  }`;

  const badgeLink = categoryName && categorySlug ? (
    <Link
      href={`/category/${categorySlug}`}
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-150 ${
        pressed
          ? "bg-red-600/25 text-red-300"
          : "bg-red-600/15 text-red-400"
      }`}
      style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
    >
      {categoryName}
    </Link>
  ) : categoryName ? (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-150 ${
        pressed
          ? "bg-red-600/25 text-red-300"
          : "bg-red-600/15 text-red-400"
      }`}
    >
      {categoryName}
    </span>
  ) : null;

  if (horizontal) {
    return (
      <article
        className={`${cardBaseClass} h-[420px] rounded-2xl md:h-[260px]`}
        onPointerDown={handlePressStart}
        onPointerUp={handlePressEnd}
        onPointerLeave={handlePressCancel}
        onPointerCancel={handlePressCancel}
        style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
      >
        <div className="flex h-full flex-col md:flex-row">
          {image && (
            <Link
              href={`/post/${id}`}
              className="block shrink-0 md:w-40 xl:w-44"
              style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
            >
              <img
                src={image}
                alt={title}
                className={`h-44 md:h-full ${imageClass}`}
              />
            </Link>
          )}

          <div className="flex flex-1 flex-col p-4">
            {categoryName && <div className="mb-2">{badgeLink}</div>}

            <Link
              href={`/post/${id}`}
              className="block"
              style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
            >
              <h3 className={`mb-2 line-clamp-2 text-base leading-6 ${titleClass}`}>
                {title}
              </h3>
            </Link>

            {renderMeta(date, author, true)}

            {excerpt && (
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">
                {excerpt}
              </p>
            )}

            <div className="mt-auto" />
          </div>
        </div>
      </article>
    );
  }

  if (compact) {
    return (
      <article
        className={`${cardBaseClass} flex h-[360px] flex-col rounded-2xl`}
        onPointerDown={handlePressStart}
        onPointerUp={handlePressEnd}
        onPointerLeave={handlePressCancel}
        onPointerCancel={handlePressCancel}
        style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
      >
        <Link
          href={`/post/${id}`}
          className="block shrink-0"
          style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
        >
          {image && (
            <div className="overflow-hidden">
              <img
                src={image}
                alt={title}
                className={`h-40 ${imageClass}`}
              />
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-4">
          {categoryName && <div className="mb-2">{badgeLink}</div>}

          <Link
            href={`/post/${id}`}
            className="block"
            style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
          >
            <h3 className={`mb-2 line-clamp-2 text-base leading-6 ${titleClass}`}>
              {title}
            </h3>
          </Link>

          {renderMeta(date, author, true)}

          {excerpt && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">
              {excerpt}
            </p>
          )}

          <div className="mt-auto" />
        </div>
      </article>
    );
  }

  return (
    <article
      className={`${cardBaseClass} flex h-[400px] flex-col rounded-3xl sm:h-[420px] lg:h-[460px]`}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerLeave={handlePressCancel}
      onPointerCancel={handlePressCancel}
      style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
    >
      <Link
        href={`/post/${id}`}
        className="block shrink-0"
        style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
      >
        {image && (
          <div className="overflow-hidden">
            <img
              src={image}
              alt={title}
              className={`h-40 sm:h-44 lg:h-52 ${imageClass}`}
            />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {categoryName && <div className="mb-3">{badgeLink}</div>}

        <Link
          href={`/post/${id}`}
          className="block"
          style={{ WebkitTapHighlightColor: "rgba(255,255,255,0.14)" }}
        >
          <h3
            className={`mb-2 line-clamp-2 text-base leading-6 sm:text-lg sm:leading-7 ${titleClass}`}
          >
            {title}
          </h3>
        </Link>

        {renderMeta(date, author)}

        {excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
            {excerpt}
          </p>
        )}

        <div className="mt-auto" />
      </div>
    </article>
  );
}