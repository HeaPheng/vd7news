import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://vd7news.com";

  return {
    rules: [
      {
        // Allow all search engines and social crawlers
        userAgent: "*",
        allow: "/",
      },
      {
        // Explicitly allow Facebook's crawler (facebookexternalhit)
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        // Allow Telegram's crawler
        userAgent: "TelegramBot",
        allow: "/",
      },
      {
        // Allow Twitter/X crawler
        userAgent: "Twitterbot",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
