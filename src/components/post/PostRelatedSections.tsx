import Link from "next/link";
import Image from "next/image";
import {
  getPostsByCategorySlug,
  getLatestPosts,
  type WPPost,
} from "@/lib/wordpress";
import { formatDate, getRelativeTimeKhmer, buildPostUrl } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPostImage(post: WPPost) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/placeholder.jpg"
  );
}

function getPostTerms(post: WPPost) {
  return post._embedded?.["wp:term"]?.flat() || [];
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function PostCard({ post }: { post: WPPost }) {
  return (
    <Link
      href={buildPostUrl(post.id, post.slug)}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-200 hover:bg-white/10 active:scale-[0.985] active:bg-white/10"
    >
      <Image
        src={getPostImage(post)}
        alt={post.title.rendered}
        width={400}
        height={260}
        className="h-28 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.99] sm:h-36 lg:h-48"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      <div className="p-3 lg:p-4">
        {renderTags(post, 2)}

        <div className="mb-2 text-xs text-white/50" suppressHydrationWarning>
          {getRelativeTimeKhmer(post.date)} — {formatDate(post.date)}
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
            href={buildPostUrl(item.id, item.slug)}
            className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-200 hover:bg-white/10 active:scale-[0.985] active:bg-white/10"
          >
            <Image
              src={getPostImage(item)}
              alt={item.title.rendered}
              width={600}
              height={400}
              className="h-44 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.99] sm:h-52"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="p-4">
              {renderTags(item, 2)}

              <h4
                className="line-clamp-2 text-base font-semibold text-white/90 transition-colors duration-200 group-hover:text-red-400 group-active:text-red-400"
                dangerouslySetInnerHTML={{ __html: item.title.rendered }}
              />
              <p className="mt-2 text-xs text-white/50" suppressHydrationWarning>
                {getRelativeTimeKhmer(item.date)} — {formatDate(item.date)}
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
    <aside className="hidden xl:col-start-3 xl:row-start-1 xl:row-span-2 xl:block">
      <div className="desktop-sidebar-scroll sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur hover:overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold uppercase tracking-wide text-red-400">
            អចលនទ្រព្យ
          </h2>
        </div>

        <div className="space-y-4">
          {posts.map((item) => (
            <Link
              key={item.id}
              href={buildPostUrl(item.id, item.slug)}
              className="group block overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-200 hover:bg-white/10 active:scale-[0.985] active:bg-white/10"
            >
              <Image
                src={getPostImage(item)}
                alt={item.title.rendered}
                width={400}
                height={260}
                className="h-36 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.99]"
                sizes="320px"
              />
              <div className="p-3">
                {renderTags(item, 2)}

                <h4
                  className="line-clamp-2 text-sm font-semibold text-white/90 transition-colors duration-200 group-hover:text-red-400 group-active:text-red-400"
                  dangerouslySetInnerHTML={{ __html: item.title.rendered }}
                />
                <p className="mt-2 text-xs text-white/50" suppressHydrationWarning>
                  {getRelativeTimeKhmer(item.date)} — {formatDate(item.date)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Main Server Component ────────────────────────────────────────────────────

type PostRelatedSectionsProps = {
  currentPostId: number;
};

export default async function PostRelatedSections({
  currentPostId,
}: PostRelatedSectionsProps) {
  let realEstatePosts: WPPost[] = [];
  let newestPosts: WPPost[] = [];
  let internationalNewsPosts: WPPost[] = [];

  try {
    const [realEstateRaw, newestRaw, internationalRaw] = await Promise.all([
      getPostsByCategorySlug("real-estate", 6),
      getLatestPosts(10),
      getPostsByCategorySlug("international-news", 10),
    ]);

    realEstatePosts = realEstateRaw
      .filter((item) => item.id !== currentPostId)
      .slice(0, 3);

    newestPosts = newestRaw
      .filter((item) => item.id !== currentPostId)
      .slice(0, 4);

    internationalNewsPosts = internationalRaw
      .filter((item) => item.id !== currentPostId)
      .slice(0, 4);
  } catch (error) {
    console.error("Related content load failed:", error);
    return (
      <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
        មិនអាចផ្ទុកព័ត៌មានបន្ថែមបានទេ
      </div>
    );
  }

  if (!newestPosts.length && !internationalNewsPosts.length && !realEstatePosts.length) {
    return null;
  }

  return (
    <>
      <div className="min-w-0 space-y-10 xl:col-start-2 xl:row-start-2">
        {/* Mobile/tablet order: real estate first and one card per row. */}
        <MobileRealEstateList posts={realEstatePosts} />

        {newestPosts.length > 0 && (
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
        )}

        {internationalNewsPosts.length > 0 && (
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
              {internationalNewsPosts.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      <DesktopRealEstateSidebar posts={realEstatePosts} />
    </>
  );
}
