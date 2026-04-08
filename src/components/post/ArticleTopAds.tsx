import ArticleTopAdsClient, { AdItem } from "./ArticleTopAdsClient";

type AdsListResponse = {
  placement: string | null;
  items: AdItem[];
};

type AdsSingleResponse = {
  placement: string;
  item: AdItem | null;
};

const wpSiteUrl =
  process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
  process.env.WORDPRESS_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "";

if (!wpSiteUrl) {
  throw new Error(
    "WordPress site URL is not defined. Set NEXT_PUBLIC_WORDPRESS_SITE_URL or WORDPRESS_SITE_URL."
  );
}

const WP_SITE_URL: string = wpSiteUrl.replace(/\/$/, "");

function buildWpSiteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${WP_SITE_URL}${cleanPath}`;
}

async function getAdsByPlacement(
  placement: "article_slider" | "article_fixed"
): Promise<AdItem[] | AdItem | null> {
  try {
    const response = await fetch(
      buildWpSiteUrl(`/wp-json/vd7/v1/ads?placement=${placement}`),
      {
        next: { revalidate: 120 },
      }
    );

    if (!response.ok) {
      return placement === "article_slider" ? [] : null;
    }

    if (placement === "article_slider") {
      const data = (await response.json()) as AdsListResponse;
      return Array.isArray(data.items) ? data.items : [];
    }

    const data = (await response.json()) as AdsSingleResponse;
    return data.item || null;
  } catch {
    return placement === "article_slider" ? [] : null;
  }
}

export default async function ArticleTopAds() {
  const [sliderAds, fixedAd] = await Promise.all([
    getAdsByPlacement("article_slider") as Promise<AdItem[]>,
    getAdsByPlacement("article_fixed") as Promise<AdItem | null>,
  ]);

  if (sliderAds.length === 0 && !fixedAd) {
    return null;
  }

  return <ArticleTopAdsClient sliderAds={sliderAds} fixedAd={fixedAd} />;
}