import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import ShareButtons from "@/src/components/post/ShareButtons";
import ScrollButtons from "@/src/components/post/ScrollButtons";
import ArticleContentWithLightbox from "@/src/components/post/ArticleContentWithLightbox";
import type { InlineAdData } from "@/src/components/post/ArticleInlineAdClient";
import ArticleTopAds from "@/src/components/post/ArticleTopAds";
import PostRelatedSections from "@/src/components/post/PostRelatedSections";
import ReadingProgressBar from "@/src/components/post/ReadingProgressBar";
import { getPostById, getPostBySlug } from "@/lib/wordpress";
import type { WPPost } from "@/lib/wordpress";
import {
  formatDate,
  getRelativeTimeKhmer,
  stripHtml,
  buildPostUrl,
  parseIdSlug,
} from "@/lib/utils";

// ─── ISR: cache article pages for 2 minutes ──────────────────────────────────

export const revalidate = 120;

// ─── Resolve post from route param (handles both old and new formats) ─────────

async function resolvePost(
  rawParam: string
): Promise<{ post: WPPost | null }> {
  const parsed = parseIdSlug(rawParam);

  if (parsed) {
    // ID-based format: /post/{id} or /post/{id}-{slug}
    // Fetch by ID — no redirect needed; proxy.ts handles URL cleanup at HTTP level
    const post = await getPostById(parsed.id);
    return { post };
  }

  // Old format: /post/{slug} — look up by slug, redirect to id-slug URL
  let decoded: string;
  try {
    decoded = decodeURIComponent(rawParam);
  } catch {
    decoded = rawParam;
  }

  const post = await getPostBySlug(decoded);
  return { post };
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

type PageProps = {
  params: Promise<{ idSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { idSlug } = await params;
  const { post } = await resolvePost(idSlug);

  if (!post) {
    return { title: "Post Not Found — VD7 News" };
  }

  const title = stripHtml(post.title.rendered);
  const description = stripHtml(post.excerpt?.rendered ?? "").slice(0, 160);
  const siteUrl = getRequiredSiteUrl();
  const canonicalUrl = `${siteUrl}${buildPostUrl(post.id, post.slug)}`;

  // Extract full image metadata — Facebook needs width + height to show preview
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = media?.source_url;
  const imageWidth = media?.media_details?.width ?? 1200;
  const imageHeight = media?.media_details?.height ?? 630;
  const imageAlt = media?.alt_text || title;
  const imageType = media?.mime_type || "image/jpeg";

  const ogImage = imageUrl
    ? {
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        alt: imageAlt,
        type: imageType,
      }
    : undefined;

  return {
    title: `${title} — VD7 News`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "VD7 News",
      locale: "km_KH",
      publishedTime: post.date,
      url: canonicalUrl,
      ...(ogImage && { images: [ogImage] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

// ─── Page Entry ───────────────────────────────────────────────────────────────

export default async function PostDetailPage({ params }: PageProps) {
  const { idSlug } = await params;

  return (
    <>
      <ReadingProgressBar />
      <Suspense fallback={<PostSkeleton />}>
        <PostContent idSlug={idSlug} />
      </Suspense>
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="mx-auto max-w-[1750px] px-2 py-8 lg:px-6">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[60px_minmax(0,1120px)_320px] 2xl:grid-cols-[80px_minmax(0,1180px)_320px]">
          <aside className="hidden xl:block" />
          <main>
            <div className="mb-6 h-12 w-full skeleton-shimmer rounded-2xl" />
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#10182b] shadow-2xl">
              <div className="h-[260px] w-full skeleton-shimmer sm:h-[340px] lg:h-[430px]" />
              <div className="mx-auto max-w-[980px] px-3 pb-10 pt-6 sm:px-8 lg:px-10">
                <div className="h-6 w-24 skeleton-shimmer rounded-full" />
                <div className="mt-4 h-10 w-3/4 skeleton-shimmer rounded-lg" />
                <div className="mt-2 h-10 w-1/2 skeleton-shimmer rounded-lg" />
                <div className="mt-4 h-4 w-40 skeleton-shimmer rounded" />
                <div className="mt-6 space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-full skeleton-shimmer rounded"
                    />
                  ))}
                </div>
              </div>
            </div>
          </main>
          <aside className="hidden xl:block" />
        </div>
      </div>
    </div>
  );
}

// ─── Inline Ad Fetcher ────────────────────────────────────────────────────────

async function getInlineAd(): Promise<InlineAdData | null> {
  const wpUrl = getWpSiteUrl();
  if (!wpUrl) return null;

  try {
    const res = await fetch(
      `${wpUrl}/wp-json/vd7/v1/ads?placement=article_inline`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.item || null;
  } catch {
    return null;
  }
}

function getWpSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
    process.env.WORDPRESS_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "";
  return url.replace(/\/$/, "");
}

// ─── Main Content ─────────────────────────────────────────────────────────────

async function PostContent({ idSlug }: { idSlug: string }) {
  const [{ post }, inlineAd] = await Promise.all([
    resolvePost(idSlug),
    getInlineAd(),
  ]);

  if (!post) notFound();

  const currentUrl = getCurrentPostUrl(post);
  const featuredImage = getPostImage(post);
  const category = getPrimaryCategory(post);
  const postTerms = getPostTerms(post);
  const isRealEstatePost = postTerms.some(
    (term) => term.slug === "real-estate"
  );

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="mx-auto max-w-[1750px] px-2 py-8 lg:px-6">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[60px_minmax(0,1120px)_320px] 2xl:grid-cols-[80px_minmax(0,1180px)_320px]">
          <aside className="hidden xl:block" />

          <main>
            {/* Ads load independently */}
            <Suspense
              fallback={
                <div className="mb-6 h-12 w-full skeleton-shimmer rounded-2xl" />
              }
            >
              <ArticleTopAds />
            </Suspense>

            <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#10182b] shadow-2xl">
              {/* Hero Image */}
              <div className="relative h-[260px] sm:h-[340px] lg:h-[430px]">
                <Image
                  src={featuredImage}
                  alt={post.title.rendered}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1120px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10182b] via-[#10182b]/35 to-transparent" />
              </div>

              <div className="mx-auto max-w-[980px] px-3 pb-10 pt-6 sm:px-8 lg:px-10">
                {category && (
                  <Link
                    href={`/category/${category.slug}`}
                    className="inline-flex rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:bg-red-500 active:scale-95 active:bg-red-500"
                  >
                    {category.name}
                  </Link>
                )}

                <h1
                  className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/60 sm:text-sm">
                  <span suppressHydrationWarning>
                    {getRelativeTimeKhmer(post.date)} —{" "}
                    {formatDate(post.date)}
                  </span>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <ShareButtons
                    title={post.title.rendered}
                    url={currentUrl}
                  />
                </div>

                <ArticleContentWithLightbox html={post.content.rendered} inlineAd={inlineAd} />

                {isRealEstatePost && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <div className="mb-5 flex flex-col items-center justify-center">
                      <p className="mb-4 text-sm font-semibold tracking-wide text-red-500 sm:text-[15px]">
                        ទំនាក់ទំនងទិញលក់
                      </p>
                      <div className="relative z-20 flex items-center justify-center gap-3">
                        <ContactIconButton
                          href="https://t.me/Insarun"
                          label="Telegram"
                        >
                          <TelegramAppIcon />
                        </ContactIconButton>
                        <ContactIconButton
                          href="https://m.me/joun.sarun"
                          label="Messenger"
                        >
                          <MessengerAppIcon />
                        </ContactIconButton>
                      </div>
                    </div>

                    <Link
                      href="https://mlmupc.gov.kh/electronic-cadastral-services/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 group flex items-center justify-between gap-3 rounded-2xl border border-blue-500/20 bg-[#0f1b33] px-4 py-4 transition-all duration-200 hover:border-blue-400/40 hover:bg-[#13203a] active:scale-[0.985] active:border-blue-400/40 active:bg-[#13203a] sm:gap-4 sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 group-active:scale-95 sm:h-14 sm:w-14">
                          <Image
                            src="/images/logo/cropped-logo.png"
                            alt="Real estate cadastral service"
                            width={32}
                            height={32}
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300 sm:text-[11px]">
                            REAL ESTATE SERVICE
                          </p>
                          <p className="mt-1 text-sm font-bold leading-5 text-white sm:text-lg sm:leading-6">
                            ស្វែងរកព័ត៌មានអំពីក្បាលដី
                          </p>
                        </div>
                      </div>
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg text-white transition-all duration-200 group-hover:translate-x-1 group-hover:bg-blue-500 group-active:scale-95 group-active:translate-x-1 group-active:bg-blue-500 sm:h-11 sm:w-11 sm:text-xl">
                        →
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </article>

          </main>

          {/* Related content streams independently into the main column and
              the desktop real-estate sidebar. */}
          <Suspense
            fallback={
              <div className="h-40 skeleton-shimmer rounded-2xl xl:col-start-2 xl:row-start-2" />
            }
          >
            <PostRelatedSections currentPostId={post.id} />
          </Suspense>
        </div>
      </div>

      <ScrollButtons showCallButton={isRealEstatePost} />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRequiredSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "";
  if (!siteUrl)
    throw new Error(
      "Missing NEXT_PUBLIC_SITE_URL (or SITE_URL) environment variable."
    );
  return siteUrl.replace(/\/$/, "");
}

function getCurrentPostUrl(post: WPPost) {
  return `${getRequiredSiteUrl()}${buildPostUrl(post.id, post.slug)}`;
}

function getPostImage(post: WPPost) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/placeholder.jpg"
  );
}

function getPostTerms(post: WPPost) {
  return post._embedded?.["wp:term"]?.flat() || [];
}

function getPrimaryCategory(post: WPPost) {
  return getPostTerms(post)[0] || null;
}

// ─── UI Components ────────────────────────────────────────────────────────────

function ContactIconButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}): React.JSX.Element {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-12 w-12 items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      {children}
    </a>
  );
}

function TelegramAppIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
      <defs>
        <linearGradient id="telegramBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#37BBFE" />
          <stop offset="100%" stopColor="#007DBB" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="18"
        fill="url(#telegramBg)"
      />
      <path
        fill="#fff"
        d="M47.3 18.9 14.7 31.5c-1.7.7-1.7 1.7-.3 2.1l8.3 2.6 3.2 10c.4 1.1.2 1.5 1.4 1.5.9 0 1.3-.4 1.8-.9l4.5-4.3 9.4 6.9c1.7 1 3 .5 3.4-1.6l5.5-26.1c.6-2.5-.9-3.7-2.9-2.8Zm-4.2 6.2L28.3 38.5l-.6 6.2-.2-.2-3.1-9.6 18.7-11.8c.8-.5 1.5.2.9.7Z"
      />
    </svg>
  );
}

function MessengerAppIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
      <defs>
        <linearGradient id="messengerBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="45%" stopColor="#0078FF" />
          <stop offset="100%" stopColor="#A033FF" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="18"
        fill="url(#messengerBg)"
      />
      <path
        fill="#fff"
        d="M32 15C22.3 15 14.5 22.2 14.5 31.3c0 5.2 2.5 9.8 6.6 12.8V49l6-3.3c1.6.4 3.2.6 4.9.6 9.7 0 17.5-7.2 17.5-16.3S41.7 15 32 15Zm2.1 21.2-4.5-4.8-8.4 4.8 9.3-9.8 4.7 4.8 8.3-4.8-9.4 9.8Z"
      />
    </svg>
  );
}
