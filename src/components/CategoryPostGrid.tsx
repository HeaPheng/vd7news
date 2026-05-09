"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NewsCard from "./NewsCard";
import { buildPostsByCategoryUrl } from "@/lib/wordpress";

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
  initialPosts?: Post[];
};

const POSTS_PER_PAGE = 9;

function stripHtml(html: string = "") {
  return html.replace(/<[^>]*>/g, "").trim();
}

function LoadMoreSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="h-32 w-full skeleton-shimmer sm:h-40 lg:h-48" />
          <div className="space-y-2 p-3 sm:p-4">
            <div className="h-3 w-20 skeleton-shimmer rounded-full" />
            <div className="h-4 w-full skeleton-shimmer rounded-lg" />
            <div className="h-4 w-4/5 skeleton-shimmer rounded-lg" />
            <div className="h-3 w-24 skeleton-shimmer rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CategoryPostGrid({
  categoryId,
  categoryName,
  initialPosts,
}: Props) {
  const hasInitialData = Array.isArray(initialPosts) && initialPosts.length > 0;

  const [posts, setPosts] = useState<Post[]>(hasInitialData ? initialPosts : []);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!hasInitialData);
  const [hasMore, setHasMore] = useState(
    hasInitialData ? initialPosts.length >= POSTS_PER_PAGE : true
  );

  const loaderRef = useRef<HTMLDivElement | null>(null);
  // Start from page 2 if we already have initial data
  const nextPageRef = useRef(hasInitialData ? 2 : 1);
  const initialLoadedRef = useRef(hasInitialData);

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const currentPage = nextPageRef.current;

      const res = await fetch(
        buildPostsByCategoryUrl(categoryId, currentPage, POSTS_PER_PAGE)
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

  // Reset when categoryId changes (but only if no initial data or category changes)
  useEffect(() => {
    if (hasInitialData) return;
    setPosts([]);
    setHasMore(true);
    setLoading(false);
    setInitialLoading(true);
    nextPageRef.current = 1;
    initialLoadedRef.current = false;
  }, [categoryId, hasInitialData]);

  // Load first page only if no initial data was provided
  useEffect(() => {
    if (initialLoadedRef.current) return;
    initialLoadedRef.current = true;
    loadPosts();
  }, [loadPosts]);

  // Infinite scroll observer
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
    return <LoadMoreSkeleton />;
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

          return (
            <NewsCard
              key={post.id}
              slug={post.slug}
              title={post.title.rendered}
              image={image}
              excerpt={stripHtml(post.excerpt?.rendered || "")}
              date={post.date}
              categoryName={categoryName}
            />
          );
        })}
      </section>

      <div ref={loaderRef} className="mt-5 min-h-16">
        {loading && posts.length > 0 && <LoadMoreSkeleton />}

        {!hasMore && posts.length > 0 && !loading && (
          <p className="text-sm text-gray-500 text-center">
            មិនមានព័ត៌មានបន្ថែមទៀតទេ
          </p>
        )}
      </div>
    </>
  );
}