import Link from "next/link";
import Image from "next/image";
import CategoryPostGrid from "../../../src/components/CategoryPostGrid";

type Category = {
  id: number;
  name: string;
  slug: string;
};

const categoryActionMap: Record<
  string,
  {
    href: string;
    label: string;
    text: string;
    logo: string;
  }
> = {
  "national-news": {
    href: "https://t.me/vd7newsdaily",
    label: "National News",
    text: "ព័ត៌មានជាតិថ្មីៗ",
    logo: "/images/logo/logo.png",
  },
  economy: {
    href: "https://www.youtube.com/@vd7newstv540",
    label: "Economy",
    text: "តាមដានព័ត៌មានសេដ្ឋកិច្ច",
    logo: "/images/logo/logo.png",
  },
  "real-estate": {
    href: "https://mlmupc.gov.kh/electronic-cadastral-services/",
    label: "Real Estate",
    text: "ស្វែងរកព័ត៌មានអំពីក្បាលដី",
    logo: "/images/logo/cropped-logo.png",
  },
  "social-events": {
    href: "https://t.me/vd7newsdaily",
    label: "Social Events",
    text: "ព្រឹត្តិការណ៍សង្គម",
    logo: "/images/logo/logo.png",
  },
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

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const data = await fetchWpJson<Category[]>(
      `/categories?slug=${encodeURIComponent(slug)}`
    );

    return data[0] || null;
  } catch {
    return null;
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 text-white">
        Category not found
      </main>
    );
  }

  const categoryAction = categoryActionMap[category.slug];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <section className="relative mb-8 md:mb-10">
        {categoryAction && (
          <div className="mb-5 flex justify-end">
            <Link
              href={categoryAction.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={categoryAction.label}
              className="inline-flex max-w-full items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-red-600"
            >
              <Image
                src={categoryAction.logo}
                alt={categoryAction.label}
                width={34}
                height={34}
                className="object-contain"
                unoptimized
              />

              <span className="text-xs font-medium leading-5 sm:text-sm">
                {categoryAction.text}
              </span>
            </Link>
          </div>
        )}

        <div className="mb-3 flex items-center gap-3">
          <span className="h-7 w-1.5 rounded-full bg-red-500" />
          <h1 className="text-2xl font-bold text-white md:text-4xl">
            {category.name}
          </h1>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
          អាប់ដេតព័ត៌មានថ្មីៗ{category.name}។
        </p>
      </section>

      <CategoryPostGrid categoryId={category.id} categoryName={category.name} />
    </main>
  );
}