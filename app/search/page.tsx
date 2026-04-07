import NewsCard from "../../src/components/NewsCard";

type Post = {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url: string;
    }[];
  };
};

const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? "";

if (!wpApiUrl) {
  throw new Error("NEXT_PUBLIC_WP_API_URL is not defined");
}

const WP_API_URL: string = wpApiUrl;

function buildWpApiUrl(endpoint: string): string {
  const base = WP_API_URL.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

async function fetchWpJson<T>(endpoint: string): Promise<T> {
  const res = await fetch(buildWpApiUrl(endpoint), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `WordPress API request failed: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

async function searchPosts(query: string): Promise<Post[]> {
  try {
    return await fetchWpJson<Post[]>(
      `/posts?search=${encodeURIComponent(query)}&_embed&per_page=20`
    );
  } catch {
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const keyword = q.trim();
  const posts = keyword ? await searchPosts(keyword) : [];

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Search Results</h1>

      {keyword ? (
        <p className="mb-6 text-gray-400">
          Results for: <span className="text-white">{keyword}</span>
        </p>
      ) : (
        <p className="mb-6 text-gray-400">Please enter a keyword to search.</p>
      )}

      {keyword && posts.length === 0 ? (
        <p className="text-gray-400">No matching posts found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const image =
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

            return (
              <NewsCard
                key={post.id}
                slug={post.slug}
                title={post.title.rendered}
                image={image}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}