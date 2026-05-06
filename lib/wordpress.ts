const API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_WP_API_URL is not defined");
}

const WP_API_URL = API_URL.replace(/\/$/, "");

// ─── Types ────────────────────────────────────────────────────────────────────

export type WPTerm = {
  id: number;
  name: string;
  slug: string;
};

export type WPFeaturedMedia = {
  source_url: string;
};

export type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: WPFeaturedMedia[];
    "wp:term"?: WPTerm[][];
  };
};

export type WPCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

// ─── Core Fetcher ─────────────────────────────────────────────────────────────

type FetchFromWPOptions = {
  revalidate?: number;
  tags?: string[];
};

async function fetchFromWP<T>(
  endpoint: string,
  options: FetchFromWPOptions = {}
): Promise<T> {
  const { revalidate = 60, tags } = options;

  const res = await fetch(`${WP_API_URL}${endpoint}`, {
    next: {
      revalidate,
      ...(tags && tags.length > 0 ? { tags } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(
      `WordPress API error — ${res.status} ${res.statusText} [${endpoint}]`
    );
  }

  return res.json() as Promise<T>;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const safeSlug = decodeURIComponent(slug);

  const data = await fetchFromWP<WPPost[]>(
    `/posts?slug=${encodeURIComponent(safeSlug)}&_embed`,
    {
      revalidate: 120,
      tags: [`post-${safeSlug}`],
    }
  );

  return data[0] ?? null;
}

export async function getPostById(id: string | number): Promise<WPPost | null> {
  try {
    const data = await fetchFromWP<WPPost>(
      `/posts/${id}?_embed`,
      {
        revalidate: 120,
        tags: [`post-${id}`],
      }
    );
    return data ?? null;
  } catch {
    return null;
  }
}

export async function getPostsByCategorySlug(
  categorySlug: string,
  perPage = 4
): Promise<WPPost[]> {
  const categories = await fetchFromWP<WPCategory[]>(
    `/categories?slug=${encodeURIComponent(categorySlug)}`,
    { revalidate: 300 }
  );

  const category = categories[0];
  if (!category) return [];

  return fetchFromWP<WPPost[]>(
    `/posts?categories=${category.id}&per_page=${perPage}&_embed`,
    {
      revalidate: 60,
      tags: [`category-${categorySlug}`],
    }
  );
}

export async function getLatestPosts(perPage = 6): Promise<WPPost[]> {
  return fetchFromWP<WPPost[]>(
    `/posts?per_page=${perPage}&_embed`,
    {
      revalidate: 60,
      tags: ["latest-posts"],
    }
  );
}