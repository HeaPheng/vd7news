const API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_WP_API_URL is not defined");
}

const WP_API_URL = API_URL.replace(/\/$/, "");

const WP_SITE_URL: string = (
  process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
  process.env.WORDPRESS_SITE_URL ||
  WP_API_URL.replace(/\/wp-json\/wp\/v2\/?$/, "")
).replace(/\/$/, "");

// ─── Field Limiting ───────────────────────────────────────────────────────────
// Reduces WP API payload by 60-80% for list views by excluding `content`.

/** Fields needed for post list/card views (no full content). */
const WP_LIST_FIELDS = "id,slug,date,title,excerpt,_links";

/** Fields needed for category lookups. */
const WP_CATEGORY_FIELDS = "id,name,slug,count";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WPTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy?: string;
};

export type WPFeaturedMedia = {
  source_url: string;
};

export type WPAuthor = {
  name: string;
};

export type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    author?: WPAuthor[];
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

/**
 * Fetch from the WordPress site URL (non-API endpoints like custom REST).
 */
export async function fetchFromWPSite<T>(
  path: string,
  options: FetchFromWPOptions = {}
): Promise<T> {
  const { revalidate = 120, tags } = options;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${WP_SITE_URL}${cleanPath}`, {
    next: {
      revalidate,
      ...(tags && tags.length > 0 ? { tags } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(
      `WordPress site API error — ${res.status} ${res.statusText} [${cleanPath}]`
    );
  }

  return res.json() as Promise<T>;
}

// ─── Post Queries ─────────────────────────────────────────────────────────────

/**
 * Get a single post by slug (full content, for detail pages).
 */
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

/**
 * Get latest posts (list view — excludes content for smaller payloads).
 */
export async function getLatestPosts(perPage = 6): Promise<WPPost[]> {
  return fetchFromWP<WPPost[]>(
    `/posts?per_page=${perPage}&_embed&_fields=${WP_LIST_FIELDS}`,
    {
      revalidate: 120,
      tags: ["latest-posts"],
    }
  );
}

/**
 * Get posts by category slug (list view — excludes content).
 * Resolves category slug → ID first, then fetches posts.
 */
export async function getPostsByCategorySlug(
  categorySlug: string,
  perPage = 4
): Promise<WPPost[]> {
  const categories = await fetchFromWP<WPCategory[]>(
    `/categories?slug=${encodeURIComponent(categorySlug)}&_fields=${WP_CATEGORY_FIELDS}`,
    { revalidate: 600 }
  );

  const category = categories[0];
  if (!category) return [];

  return fetchFromWP<WPPost[]>(
    `/posts?categories=${category.id}&per_page=${perPage}&_embed&_fields=${WP_LIST_FIELDS}`,
    {
      revalidate: 120,
      tags: [`category-${categorySlug}`],
    }
  );
}

/**
 * Search posts (list view — excludes content).
 */
export async function searchPosts(
  query: string,
  perPage = 20
): Promise<WPPost[]> {
  return fetchFromWP<WPPost[]>(
    `/posts?search=${encodeURIComponent(query)}&_embed&per_page=${perPage}&_fields=${WP_LIST_FIELDS}`,
    {
      revalidate: 60,
      tags: ["search"],
    }
  );
}

// ─── Category Queries ─────────────────────────────────────────────────────────

/**
 * Get a single category by slug.
 */
export async function getCategoryBySlug(
  slug: string
): Promise<WPCategory | null> {
  try {
    const data = await fetchFromWP<WPCategory[]>(
      `/categories?slug=${encodeURIComponent(slug)}&_fields=${WP_CATEGORY_FIELDS}`,
      { revalidate: 600 }
    );
    return data[0] || null;
  } catch {
    return null;
  }
}

/**
 * Get all categories (for navigation menu).
 * Cached for 1 hour since categories rarely change.
 */
export async function getCategories(perPage = 100): Promise<WPCategory[]> {
  try {
    return await fetchFromWP<WPCategory[]>(
      `/categories?per_page=${perPage}&_fields=${WP_CATEGORY_FIELDS}`,
      { revalidate: 3600, tags: ["categories"] }
    );
  } catch {
    return [];
  }
}

/**
 * Get posts by category ID (list view — for client-side pagination).
 * Used by CategoryPostGrid for page 2+ loading.
 */
export function buildPostsByCategoryUrl(
  categoryId: number,
  page: number,
  perPage: number
): string {
  return `${WP_API_URL}/posts?categories=${categoryId}&_embed&per_page=${perPage}&page=${page}&_fields=${WP_LIST_FIELDS}`;
}