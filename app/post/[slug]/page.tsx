import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import ShareButtons from "@/src/components/post/ShareButtons";
import ScrollButtons from "@/src/components/post/ScrollButtons";
import ArticleContentWithLightbox from "@/src/components/post/ArticleContentWithLightbox";
import ArticleTopAds from "@/src/components/post/ArticleTopAds";
import {
  getPostBySlug,
  getPostsByCategorySlug,
  getLatestPosts,
} from "@/lib/wordpress";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type WPTerm = {
  id: number;
  name: string;
  slug: string;
};

type WPFeaturedMedia = {
  source_url: string;
};

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: WPFeaturedMedia[];
    "wp:term"?: WPTerm[][];
  };
};

function getRequiredSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "";

  if (!siteUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SITE_URL (or SITE_URL) environment variable."
    );
  }

  return siteUrl.replace(/\/$/, "");
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

function formatDate(date: string) {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

function getRelativeTime(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "មុននេះបន្តិច";
  if (minutes < 60) return `${minutes} នាទីមុន`;
  if (hours < 24) return `${hours} ម៉ោងមុន`;
  if (days < 30) return `${days} ថ្ងៃមុន`;

  const months = Math.floor(days / 30);
  if (months >= 1 && months < 12) {
    return `${months} ខែមុន`;
  }

  const years = Math.floor(days / 365);
  return `${years} ឆ្នាំមុន`;
}

function renderTags(post: WPPost, limit: number = 2) {
  const terms = getPostTerms(post).slice(0, limit);

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {terms.map((term) => (
        <span
          key={`${post.id}-${term.id}`}
          className="rounded-full bg-red-600/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
        >
          {term.name}
        </span>
      ))}
    </div>
  );
}

function PostCard({ post }: { post: WPPost }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-200 hover:bg-white/10 active:scale-[0.985] active:bg-white/10"
    >
      <img
        src={getPostImage(post)}
        alt={post.title.rendered}
        className="h-28 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.99] sm:h-36 lg:h-48"
      />

      <div className="p-3 lg:p-4">
        {renderTags(post, 2)}

        <div className="mb-2 text-xs text-white/50">
          {getRelativeTime(post.date)} — {formatDate(post.date)}
        </div>

        <h3
          className="line-clamp-3 text-sm font-semibold text-white/90 transition-colors duration-200 group-hover:text-red-400 group-active:text-red-400 lg:text-base"
          dangerouslySetInnerHTML={{
            __html: post.title.rendered,
          }}
        />
      </div>
    </Link>
  );
}

async function getCurrentPostUrl(slug: string) {
  const headerStore = await headers();

  const forwardedProto = headerStore.get("x-forwarded-proto");
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost || headerStore.get("host");

  if (host) {
    const protocol =
      forwardedProto || (host.includes("localhost") ? "http" : "https");
    return `${protocol}://${host}/post/${slug}`;
  }

  return `${getRequiredSiteUrl()}/post/${slug}`;
}

function ContactIconButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
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

function TelegramAppIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
      <defs>
        <linearGradient id="telegramBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#37BBFE" />
          <stop offset="100%" stopColor="#007DBB" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="18" fill="url(#telegramBg)" />
      <path
        fill="#fff"
        d="M47.3 18.9 14.7 31.5c-1.7.7-1.7 1.7-.3 2.1l8.3 2.6 3.2 10c.4 1.1.2 1.5 1.4 1.5.9 0 1.3-.4 1.8-.9l4.5-4.3 9.4 6.9c1.7 1 3 .5 3.4-1.6l5.5-26.1c.6-2.5-.9-3.7-2.9-2.8Zm-4.2 6.2L28.3 38.5l-.6 6.2-.2-.2-3.1-9.6 18.7-11.8c.8-.5 1.5.2.9.7Z"
      />
    </svg>
  );
}

function MessengerAppIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
      <defs>
        <linearGradient id="messengerBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="45%" stopColor="#0078FF" />
          <stop offset="100%" stopColor="#A033FF" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="18" fill="url(#messengerBg)" />
      <path
        fill="#fff"
        d="M32 15C22.3 15 14.5 22.2 14.5 31.3c0 5.2 2.5 9.8 6.6 12.8V49l6-3.3c1.6.4 3.2.6 4.9.6 9.7 0 17.5-7.2 17.5-16.3S41.7 15 32 15Zm2.1 21.2-4.5-4.8-8.4 4.8 9.3-9.8 4.7 4.8 8.3-4.8-9.4 9.8Z"
      />
    </svg>
  );
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const post: WPPost | null = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage = getPostImage(post);
  const category = getPrimaryCategory(post);
  const postTerms = getPostTerms(post);

  const isRealEstatePost = postTerms.some(
    (term) => term.slug === "real-estate"
  );

  const realEstatePosts: WPPost[] = (
    await getPostsByCategorySlug("real-estate", 6)
  )
    .filter((item: WPPost) => item.id !== post.id)
    .slice(0, 3);

  const newestPosts: WPPost[] = (await getLatestPosts(10))
    .filter((item: WPPost) => item.id !== post.id)
    .slice(0, 4);

  const internationalNewsPosts: WPPost[] = (
    await getPostsByCategorySlug("international-news", 10)
  )
    .filter((item: WPPost) => item.id !== post.id)
    .slice(0, 4);

  const currentUrl = await getCurrentPostUrl(post.slug);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="mx-auto max-w-[1750px] px-2 py-8 lg:px-6">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[60px_minmax(0,1120px)_320px] 2xl:grid-cols-[80px_minmax(0,1180px)_320px]">
          <aside className="hidden xl:block" />

          <main>
            <ArticleTopAds />

            <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#10182b] shadow-2xl">
              <div className="relative">
                <img
                  src={featuredImage}
                  alt={post.title.rendered}
                  className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[430px]"
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
                  <span>
                    {getRelativeTime(post.date)} — {formatDate(post.date)}
                  </span>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <ShareButtons title={post.title.rendered} url={currentUrl} />
                </div>

                <ArticleContentWithLightbox html={post.content.rendered} />

                {isRealEstatePost && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <div className="mb-5 flex flex-col items-center justify-center">
                      <p className="mb-4 text-sm font-semibold tracking-wide text-red-500 sm:text-[15px]">
                        ទំនាក់ទំនងទិញលក់
                      </p>

                      <div className="flex items-center justify-center gap-3">
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
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-blue-500/20 bg-[#0f1b33] px-4 py-4 transition-all duration-200 hover:border-blue-400/40 hover:bg-[#13203a] active:scale-[0.985] active:border-blue-400/40 active:bg-[#13203a] sm:gap-4 sm:px-5"
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

            <section className="mt-10 space-y-10">
              <div className="xl:hidden">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">អចលនទ្រព្យ</h2>

                  <Link
                    href="/category/real-estate"
                    className="text-sm font-medium text-red-400 transition-colors duration-200 hover:text-red-300 active:text-red-300"
                  >
                    See more
                  </Link>
                </div>

                <div className="space-y-4">
                  {realEstatePosts.map((item) => (
                    <Link
                      key={item.id}
                      href={`/post/${item.slug}`}
                      className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-200 hover:bg-white/10 active:scale-[0.985] active:bg-white/10"
                    >
                      <img
                        src={getPostImage(item)}
                        alt={item.title.rendered}
                        className="h-44 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.99] sm:h-52"
                      />
                      <div className="p-4">
                        {renderTags(item, 2)}

                        <h4
                          className="line-clamp-2 text-base font-semibold text-white/90 transition-colors duration-200 group-hover:text-red-400 group-active:text-red-400"
                          dangerouslySetInnerHTML={{
                            __html: item.title.rendered,
                          }}
                        />
                        <p className="mt-2 text-xs text-white/50">
                          {getRelativeTime(item.date)} — {formatDate(item.date)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">ព័ត៌មានក្តៅៗ</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                  {newestPosts.map((item) => (
                    <PostCard key={item.id} post={item} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    ព័ត៌មានអន្តរជាតិ
                  </h2>

                  <Link
                    href="/category/international-news"
                    className="text-sm font-medium text-red-400 transition-colors duration-200 hover:text-red-300 active:text-red-300"
                  >
                    ច្រើនទៀត
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                  {internationalNewsPosts.map((item) => (
                    <PostCard key={item.id} post={item} />
                  ))}
                </div>
              </div>
            </section>
          </main>

          <aside className="hidden xl:block">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="font-semibold uppercase tracking-wide text-red-400">
                  អចលនទ្រព្យ
                </h1>
              </div>

              <div className="space-y-4">
                {realEstatePosts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/post/${item.slug}`}
                    className="group block overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-200 hover:bg-white/10 active:scale-[0.985] active:bg-white/10"
                  >
                    <img
                      src={getPostImage(item)}
                      alt={item.title.rendered}
                      className="h-36 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.99]"
                    />
                    <div className="p-3">
                      {renderTags(item, 2)}

                      <h4
                        className="line-clamp-2 text-sm font-semibold text-white/90 transition-colors duration-200 group-hover:text-red-400 group-active:text-red-400"
                        dangerouslySetInnerHTML={{ __html: item.title.rendered }}
                      />
                      <p className="mt-2 text-xs text-white/50">
                        {getRelativeTime(item.date)} — {formatDate(item.date)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <ScrollButtons showCallButton={isRealEstatePost} />
    </div>
  );
}