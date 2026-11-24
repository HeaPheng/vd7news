import Link from "next/link";
import Image from "next/image";
import { FiClock } from "react-icons/fi";
import { formatDate, getRelativeTimeKhmer, buildPostUrl } from "@/lib/utils";

type NewsCardProps = {
  id: number;
  slug: string;
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
          <span suppressHydrationWarning>
            {getRelativeTimeKhmer(date)} — {formatDate(date)}
          </span>
        </>
      )}
      {author && <span>{date ? " • " : ""}{author}</span>}
    </div>
  );
}

export default function NewsCard({
  id,
  slug,
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
  const postHref = buildPostUrl(id, slug);

  const badgeLink = categoryName && categorySlug ? (
    <Link
      href={`/category/${categorySlug}`}
      className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold bg-red-600/15 text-red-400 transition-all duration-150 active:bg-red-600/25 active:text-red-300"
    >
      {categoryName}
    </Link>
  ) : categoryName ? (
    <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold bg-red-600/15 text-red-400">
      {categoryName}
    </span>
  ) : null;

  if (horizontal) {
    return (
      <article className="news-card group overflow-hidden border border-white/5 bg-white/5 transition-all duration-300 w-full h-[420px] rounded-2xl md:h-[260px] active:scale-[0.98] active:border-white/10 hover:border-white/10 hover:bg-white/[0.07]">
        <div className="flex h-full flex-col md:flex-row">
          {image && (
            <Link href={postHref} className="block shrink-0 md:w-40 xl:w-44">
              <Image
                src={image}
                alt={title}
                width={600}
                height={400}
                className="h-44 md:h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-active:scale-100"
                sizes="(max-width: 768px) 100vw, 180px"
              />
            </Link>
          )}

          <div className="flex flex-1 flex-col p-4">
            {categoryName && <div className="mb-2">{badgeLink}</div>}

            <Link href={postHref} className="block">
              <h3 className="mb-2 line-clamp-2 text-base leading-snug font-bold text-white transition-colors duration-200 group-hover:text-red-400">
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
      <article className="news-card group overflow-hidden border border-white/5 bg-white/5 transition-all duration-300 w-full flex h-[360px] flex-col rounded-2xl active:scale-[0.98] active:border-white/10 hover:border-white/10 hover:bg-white/[0.07]">
        <Link href={postHref} className="block shrink-0">
          {image && (
            <div className="overflow-hidden">
              <Image
                src={image}
                alt={title}
                width={600}
                height={400}
                className="h-40 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-active:scale-100"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-4">
          {categoryName && <div className="mb-2">{badgeLink}</div>}

          <Link href={postHref} className="block">
            <h3 className="mb-2 line-clamp-2 text-base leading-snug font-bold text-white transition-colors duration-200 group-hover:text-red-400">
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
    <article className="news-card group overflow-hidden border border-white/5 bg-white/5 transition-all duration-300 w-full flex h-[400px] flex-col rounded-3xl sm:h-[420px] lg:h-[460px] active:scale-[0.98] active:border-white/10 hover:border-white/10 hover:bg-white/[0.07]">
      <Link href={postHref} className="block shrink-0">
        {image && (
          <div className="overflow-hidden">
            <Image
              src={image}
              alt={title}
              width={600}
              height={400}
              className="h-40 sm:h-44 lg:h-52 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-active:scale-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {categoryName && <div className="mb-3">{badgeLink}</div>}

        <Link href={postHref} className="block">
          <h3 className="mb-2 line-clamp-2 text-base leading-snug sm:text-lg font-bold text-white transition-colors duration-200 group-hover:text-red-400">
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