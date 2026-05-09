import { NextRequest, NextResponse } from "next/server";

/**
 * Strip non-ASCII characters from a URL slug.
 * Khmer slugs become just the numeric ID: /post/5643
 * English slugs are preserved: /post/5726-breaking-news
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only handle /post/... routes
  if (!pathname.startsWith("/post/")) return NextResponse.next();

  const segment = pathname.slice("/post/".length); // e.g. "5643-ព័ត៌មាន" or "%e1%9e..."

  // Decode percent-encoding so we can inspect the actual characters
  let decoded: string;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    decoded = segment;
  }

  // Must start with a numeric ID
  const match = decoded.match(/^(\d+)(?:-(.+))?$/);
  if (!match) return NextResponse.next();

  const id = match[1];
  const slug = match[2] ?? "";

  // If slug contains non-ASCII (Khmer etc.), redirect to ID-only URL
  if (slug && /[^\x00-\x7F]/.test(slug)) {
    const clean = req.nextUrl.clone();
    clean.pathname = `/post/${id}`;
    return NextResponse.redirect(clean, { status: 308 }); // permanent
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/post/:path*"],
};
