import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.vd7news.com",
      },
    ],
  },

  async headers() {
    return [
      {
        // Allow social crawlers to access all post pages
        source: "/post/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        // Proxy old WordPress media files to the CMS subdomain
        // This ensures old image URLs (vd7news.com/wp-content/...) still work after switching DNS
        source: "/wp-content/:path*",
        destination: "https://cms.vd7news.com/wp-content/:path*",
      },
      {
        source: "/wp-includes/:path*",
        destination: "https://cms.vd7news.com/wp-includes/:path*",
      },
    ];
  },
};

export default nextConfig;