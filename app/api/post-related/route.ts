import { NextResponse } from "next/server";
import {
  getPostBySlug,
  getPostsByCategorySlug,
  getLatestPosts,
} from "@/lib/wordpress";

type WPTerm = {
  id: number;
  name: string;
  slug: string;
};

type WPFeaturedMedia = {
  source_url: string;
};

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: {
    rendered: string;
  };
  content?: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: WPFeaturedMedia[];
    "wp:term"?: WPTerm[][];
  };
};

function safeDecodeSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSlug = searchParams.get("slug") || "";
    const slug = safeDecodeSlug(rawSlug);

    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug query parameter" },
        { status: 400 }
      );
    }

    const post = (await getPostBySlug(slug)) as WPPost | null;

    if (!post) {
      return NextResponse.json(
        { error: `Post not found for slug: ${slug}` },
        { status: 404 }
      );
    }

    const postTerms = post._embedded?.["wp:term"]?.flat() || [];
    const isRealEstatePost = postTerms.some(
      (term) => term.slug === "real-estate"
    );

    const [realEstateRaw, newestRaw, internationalRaw] = await Promise.all([
      getPostsByCategorySlug("real-estate", 6),
      getLatestPosts(10),
      getPostsByCategorySlug("international-news", 10),
    ]);

    const realEstatePosts = (realEstateRaw as WPPost[])
      .filter((item) => item.id !== post.id)
      .slice(0, 3);

    const newestPosts = (newestRaw as WPPost[])
      .filter((item) => item.id !== post.id)
      .slice(0, 4);

    const internationalNewsPosts = (internationalRaw as WPPost[])
      .filter((item) => item.id !== post.id)
      .slice(0, 4);

    return NextResponse.json(
      {
        isRealEstatePost,
        realEstatePosts,
        newestPosts,
        internationalNewsPosts,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=120, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("post-related API error:", error);

    return NextResponse.json(
      { error: "Failed to load related content" },
      { status: 500 }
    );
  }
}