const API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_WP_API_URL is not defined");
}

const WP_API_URL = API_URL.replace(/\/$/, "");

type FetchFromWPOptions = {
  revalidate?: number;
};

async function fetchFromWP<T>(
  endpoint: string,
  options: FetchFromWPOptions = {}
): Promise<T> {
  const { revalidate = 60 } = options;

  const res = await fetch(`${WP_API_URL}${endpoint}`, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(
      `WordPress API request failed: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

export async function getPostBySlug(slug: string) {
  const safeSlug = decodeURIComponent(slug);

  const data = await fetchFromWP<any[]>(
    `/posts?slug=${encodeURIComponent(safeSlug)}&_embed`,
    { revalidate: 120 }
  );

  return data[0] || null;
}

export async function getPostsByCategorySlug(
  categorySlug: string,
  perPage: number = 4
) {
  const categories = await fetchFromWP<any[]>(
    `/categories?slug=${encodeURIComponent(categorySlug)}`,
    { revalidate: 300 }
  );

  const category = categories[0];

  if (!category) return [];

  return fetchFromWP<any[]>(
    `/posts?categories=${category.id}&per_page=${perPage}&_embed`,
    { revalidate: 60 }
  );
}

export async function getLatestPosts(perPage: number = 6) {
  return fetchFromWP<any[]>(
    `/posts?per_page=${perPage}&_embed`,
    { revalidate: 60 }
  );
}