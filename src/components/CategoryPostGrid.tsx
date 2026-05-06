"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NewsCard from "./NewsCard";

type Post = {
  id: number;
  slug: string;
  date: string;
  title: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url: string;
    }[];
  };
};

type Props = {
  categoryId: number;
  categoryName: string;
};

const POSTS_PER_PAGE = 9;
const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? "";

function stripHtml(html: string = "") {
  return html.replace(/<[^>]*>/g, "").trim();
}

function buildWpApiUrl(endpoint: string): string {
  const base = wpApiUrl.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="h-32 w-full animate-pulse bg-white/10 sm:h-40 lg:h-48" />
      <div className="space-y-2 p-3 sm:p-4">
        <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-white/10" />
        <div className="h-4 w-4/5 animate-pulse rounded-lg bg-white/10" />
        <div className="h-3 w-24 animate-pulse rounded-lg bg-white/10" />
      </div>
    </div>
  );
}

function LoadMoreSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export default function CategoryPostGrid({
  categoryId,
  categoryName,
}: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [pressedId, setPressedId] = useState<number | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const nextPageRef = useRef(1);
  const initialLoadedRef = useRef(false);
  const releaseTimerRef = useRef<number | null>(null);

  const clearReleaseTimer = () => {
    if (releaseTimerRef.current) {
      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
  };

  const holdRelease = () => {
    clearReleaseTimer();
    releaseTimerRef.current = window.setTimeout(() => {
      setPressedId(null);
    }, 160);
  };

  const loadPosts = useCallback(async () => {
    if (!wpApiUrl) {
      console.error("NEXT_PUBLIC_WP_API_URL is not defined");
      setHasMore(false);
      setInitialLoading(false);
      return;
    }

    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const currentPage = nextPageRef.current;

      const res = await fetch(
        buildWpApiUrl(
          `/posts?categories=${categoryId}&_embed&per_page=${POSTS_PER_PAGE}&page=${currentPage}`
        ),
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        setHasMore(false);
        return;
      }

      const data: Post[] = await res.json();

      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post.id));
        const newPosts = data.filter((post) => !existingIds.has(post.id));
        return [...prev, ...newPosts];
      });

      if (data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      } else {
        nextPageRef.current += 1;
      }
    } catch (error) {
      console.error("Failed to load category posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [categoryId, loading, hasMore]);

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    setLoading(false);
    setInitialLoading(true);
    setPressedId(null);
    nextPageRef.current = 1;
    initialLoadedRef.current = false;
    clearReleaseTimer();
  }, [categoryId]);

  useEffect(() => {
    if (initialLoadedRef.current) return;
    initialLoadedRef.current = true;
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          loadPosts();
        }
      },
      {
        rootMargin: "300px",
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [loadPosts, loading, hasMore]);

  if (initialLoading) {
    return (
      <>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </section>
      </>
    );
  }

  if (!loading && posts.length === 0) {
    return <p className="text-gray-300">No posts found in this category.</p>;
  }

  return (
    <>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => {
          const image =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            "/images/placeholders/default-post.jpg";

          const isPressed = pressedId === post.id;

          return (
            <div
              key={post.id}
              onPointerDown={() => setPressedId(post.id)}
              onPointerUp={holdRelease}
              onPointerLeave={() => setPressedId(null)}
              onPointerCancel={() => setPressedId(null)}
              className={`rounded-2xl transition-all duration-150 ${
                isPressed
                  ? "scale-[0.97] brightness-110 ring-2 ring-red-500/30"
                  : "scale-100"
              }`}
            >
              <NewsCard
                id={post.id}
                title={post.title.rendered}
                image={image}
                excerpt={stripHtml(post.excerpt?.rendered || "")}
                date={post.date}
                categoryName={categoryName}
              />
            </div>
          );
        })}
      </section>

      <div ref={loaderRef} className="mt-5 min-h-16">
        {loading && posts.length > 0 && (
          <p className="text-sm text-gray-400 text-center">
            កំពុងផ្ទុកព័ត៌មានបន្ថែម...
          </p>
        )}

        {!hasMore && posts.length > 0 && !loading && (
          <p className="text-sm text-gray-500 text-center">
            មិនមានព័ត៌មានបន្ថែមទៀតទេ
          </p>
        )}
      </div>
    </>
  );
}