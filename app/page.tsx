import Link from "next/link";
import HeroSlider from "../src/components/HeroSlider";
import NewsCard from "../src/components/NewsCard";
import ArticleTopAdsClient, {
  AdItem,
} from "../src/components/post/ArticleTopAdsClient";

type WPAuthor = {
  name: string;
};

type WPTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    author?: WPAuthor[];
    "wp:featuredmedia"?: {
      source_url: string;
    }[];
    "wp:term"?: WPTerm[][];
  };
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

type MappedPost = {
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

type AdsListResponse = {
  placement: string | null;
  items: AdItem[];
};

const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? "";

if (!wpApiUrl) {
  throw new Error("NEXT_PUBLIC_WP_API_URL is not defined");
}

const WP_API_URL: string = wpApiUrl.replace(/\/$/, "");

const WP_SITE_URL: string = (
  process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
  process.env.WORDPRESS_SITE_URL ||
  WP_API_URL.replace(/\/wp-json\/wp\/v2\/?$/, "")
).replace(/\/$/, "");

function buildWpApiUrl(endpoint: string): string {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${WP_API_URL}${path}`;
}

function buildWpSiteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${WP_SITE_URL}${cleanPath}`;
}

async function fetchWpJson<T>(
  endpoint: string,
  revalidate: number = 120
): Promise<T> {
  const res = await fetch(buildWpApiUrl(endpoint), {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(
      `WordPress API request failed: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "...";
}

function getPrimaryCategory(post: WPPost): WPTerm | null {
  const terms = post._embedded?.["wp:term"] || [];
  const flat = terms.flat();
  return flat.find((term) => term.taxonomy === "category") || null;
}

function mapPost(
  post: WPPost,
  forcedCategory?: { name: string; slug: string }
): MappedPost {
  const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const author = post._embedded?.author?.[0]?.name || "Admin";
  const category = forcedCategory || getPrimaryCategory(post);

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: truncate(stripHtml(post.excerpt.rendered), 90),
    image,
    date: post.date,
    author,
    categoryName: category?.name || "News",
    categorySlug: category?.slug || "",
  };
}

async function getLatestPosts(limit = 4): Promise<WPPost[]> {
  try {
    return await fetchWpJson<WPPost[]>(`/posts?_embed&per_page=${limit}`, 120);
  } catch {
    return [];
  }
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const data = await fetchWpJson<Category[]>(
      `/categories?slug=${encodeURIComponent(slug)}`,
      600
    );

    return data[0] || null;
  } catch {
    return null;
  }
}

async function getPostsByCategory(
  categorySlug: string,
  limit = 4
): Promise<{ category: Category | null; posts: WPPost[] }> {
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return { category: null, posts: [] };
  }

  try {
    const posts = await fetchWpJson<WPPost[]>(
      `/posts?categories=${category.id}&_embed&per_page=${limit}`,
      120
    );

    return { category, posts };
  } catch {
    return { category, posts: [] };
  }
}

async function getHomeSliderAds(): Promise<AdItem[]> {
  try {
    const res = await fetch(
      buildWpSiteUrl("/wp-json/vd7/v1/ads?placement=article_slider"),
      {
        next: { revalidate: 120 },
      }
    );

    if (!res.ok) return [];

    const data = (await res.json()) as AdsListResponse;
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

function SectionHeader({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-4 border-b border-white/10 pb-3">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="h-px flex-1 bg-red-500/40" />
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-red-400 transition hover:text-red-300"
        >
          ច្រើនទៀត
        </Link>
      )}
    </div>
  );
}

function CategoryRow({
  title,
  categorySlug,
  posts,
}: {
  title: string;
  categorySlug?: string;
  posts: MappedPost[];
}) {
  if (!posts.length) return null;

  return (
    <section className="mt-10">
      <SectionHeader
        title={title}
        href={categorySlug ? `/category/${categorySlug}` : undefined}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {posts.map((post) => (
          <NewsCard
            key={post.id}
            id={post.id}
            title={post.title}
            image={post.image}
            excerpt={post.excerpt}
            date={post.date}
            author={post.author}
            categoryName={post.categoryName}
            categorySlug={post.categorySlug}
            compact
          />
        ))}
      </div>

      {categorySlug && (
        <div className="mt-5 flex justify-center">
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex rounded-full border border-red-500/40 px-5 py-2 text-sm font-medium text-red-400 transition hover:bg-red-600/10 hover:text-red-300"
          >
            ច្រើនទៀត
          </Link>
        </div>
      )}
    </section>
  );
}

export default async function Home() {
  const [
    latestPosts,
    realEstateData,
    nationalData,
    internationalData,
    economyData,
    othersData,
    homeSliderAds,
  ] = await Promise.all([
    getLatestPosts(4),
    getPostsByCategory("real-estate", 2),
    getPostsByCategory("national-news", 4),
    getPostsByCategory("international-news", 4),
    getPostsByCategory("economy", 4),
    getPostsByCategory("others", 4),
    getHomeSliderAds(),
  ]);

  const sliderPosts = latestPosts.map((post) => mapPost(post));

  const realEstateCards = realEstateData.posts.map((post) =>
    mapPost(post, realEstateData.category || undefined)
  );

  const nationalCards = nationalData.posts.map((post) =>
    mapPost(post, nationalData.category || undefined)
  );

  const internationalCards = internationalData.posts.map((post) =>
    mapPost(post, internationalData.category || undefined)
  );

  const economyCards = economyData.posts.map((post) =>
    mapPost(post, economyData.category || undefined)
  );

  const socialCards = othersData.posts.map((post) =>
    mapPost(post, othersData.category || undefined)
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.9fr_0.95fr]">
        <div className="flex min-h-[420px] flex-col">
          <HeroSlider posts={sliderPosts} />

          {homeSliderAds.length > 0 && (
            <div className="mt-4">
              <ArticleTopAdsClient sliderAds={homeSliderAds} fixedAd={null} />
            </div>
          )}
        </div>

        <aside className="flex min-h-[420px] flex-col">
          <SectionHeader
            title={realEstateData.category?.name || "Real Estate"}
            href={
              realEstateData.category?.slug
                ? `/category/${realEstateData.category.slug}`
                : undefined
            }
          />

          <div className="flex flex-1 flex-col gap-4">
            {realEstateCards.map((post) => (
              <NewsCard
                key={post.id}
                id={post.id}
                title={post.title}
                image={post.image}
                excerpt={post.excerpt}
                date={post.date}
                author={post.author}
                categoryName={post.categoryName}
                categorySlug={post.categorySlug}
                compact
              />
            ))}
          </div>
        </aside>
      </section>

      <CategoryRow
        title={nationalData.category?.name || "National News"}
        categorySlug={nationalData.category?.slug}
        posts={nationalCards}
      />

      <CategoryRow
        title={internationalData.category?.name || "International News"}
        categorySlug={internationalData.category?.slug}
        posts={internationalCards}
      />

      <CategoryRow
        title={economyData.category?.name || "Economy"}
        categorySlug={economyData.category?.slug}
        posts={economyCards}
      />

      <CategoryRow
        title={othersData.category?.name || "Social Events"}
        categorySlug={othersData.category?.slug}
        posts={socialCards}
      />
    </main>
  );
}