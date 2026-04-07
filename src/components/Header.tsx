import Navbar from "./Navbar";

type Category = {
  id: number;
  name: string;
  slug: string;
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

async function getCategories(): Promise<Category[]> {
  try {
    return await fetchWpJson<Category[]>(
      "/categories?per_page=100"
    );
  } catch {
    return [];
  }
}

const allowedCategorySlugs = [
  "national-news",
  "international-news",
  "economy",
  "real-estate",
  "social-events",
  "others",
];

export default async function Header() {
  const categories = await getCategories();

  const filteredCategories = allowedCategorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is Category => Boolean(category));

  const menuItems = [
    { name: "ទំព័រដើម", href: "/" },
    ...filteredCategories.map((category) => ({
      name: category.name,
      href: `/category/${category.slug}`,
    })),
  ];

  return <Navbar menuItems={menuItems} />;
}