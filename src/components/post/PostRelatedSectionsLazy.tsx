"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  _embedded?: {
    "wp:featuredmedia"?: WPFeaturedMedia[];
    "wp:term"?: WPTerm[][];
  };
};

type RelatedResponse = {
  isRealEstatePost: boolean;
  realEstatePosts: WPPost[];
  newestPosts: WPPost[];
  internationalNewsPosts: WPPost[];
};

function getPostImage(post: WPPost) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/placeholder.jpg"
  );
}

function getPostTerms(post: WPPost) {
  return post._embedded?.["wp:term"]?.flat() || [];
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
  if (months >= 1 && months < 12) return `${months} ខែមុន`;

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
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
      </div>
    </Link>
  );
}

function MobileRealEstateList({ posts }: { posts: WPPost[] }) {
  if (!posts.length) return null;

  return (
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
        {posts.map((item) => (
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
  );
}

function DesktopRealEstateSidebar({ posts }: { posts: WPPost[] }) {
  if (!posts.length) return null;

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold uppercase tracking-wide text-red-400">
            អចលនទ្រព្យ
          </h2>
        </div>

        <div className="space-y-4">
          {posts.map((item) => (
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
  );
}

export default function PostRelatedSectionsLazy({
  slug,
}: {
  slug: string;
}) {
  const [data, setData] = useState<RelatedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setError("");

        const params = new URLSearchParams({ slug });
        const res = await fetch(`/api/post-related?${params.toString()}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const json = (await res.json()) as RelatedResponse;

        console.log("Related content JSON:", json);

        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        console.error("Related content load failed:", err);
        if (isMounted) {
          setError("មិនអាចផ្ទុកព័ត៌មានបន្ថែមបានទេ");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
        កំពុងផ្ទុកព័ត៌មានបន្ថែម...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-10 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-sm text-yellow-200">
        មិនមានទិន្នន័យត្រូវបង្ហាញ
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-10">
      <MobileRealEstateList posts={data.realEstatePosts || []} />

      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">ព័ត៌មានក្តៅៗ</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {(data.newestPosts || []).map((item) => (
            <PostCard key={item.id} post={item} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">ព័ត៌មានអន្តរជាតិ</h2>

          <Link
            href="/category/international-news"
            className="text-sm font-medium text-red-400 transition-colors duration-200 hover:text-red-300 active:text-red-300"
          >
            ច្រើនទៀត
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {(data.internationalNewsPosts || []).map((item) => (
            <PostCard key={item.id} post={item} />
          ))}
        </div>
      </div>

      <DesktopRealEstateSidebar posts={data.realEstatePosts || []} />
    </div>
  );
}