// ─── Shared Utility Functions ─────────────────────────────────────────────────
// Consolidated from duplicated code across:
//   app/page.tsx, app/post/[slug]/page.tsx, app/search/page.tsx,
//   src/components/NewsCard.tsx, src/components/post/PostRelatedSectionsLazy.tsx

/**
 * Strip HTML tags from a string.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Truncate text to a max length, appending "..." if truncated.
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "...";
}

/**
 * Format a date string as DD/MM/YYYY.
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Get a relative time string in Khmer (e.g. "5 នាទីមុន").
 * Safe for server-side rendering — uses the provided reference time
 * or falls back to Date.now().
 */
export function getRelativeTimeKhmer(
  dateString: string,
  nowMs?: number
): string {
  const dateMs = new Date(dateString).getTime();
  if (Number.isNaN(dateMs)) return "";

  const now = nowMs ?? Date.now();
  const diffMs = now - dateMs;

  if (diffMs < 0) return formatDate(dateString);

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  const minutes = Math.floor(diffMs / minute);
  const hours = Math.floor(diffMs / hour);
  const days = Math.floor(diffMs / day);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return "មុននេះបន្តិច";
  if (minutes < 60) return `${minutes} នាទីមុន`;
  if (hours < 24) return `${hours} ម៉ោងមុន`;
  if (days < 30) return `${days} ថ្ងៃមុន`;
  if (months >= 1 && months < 12) return `${months} ខែមុន`;
  return `${years} ឆ្នាំមុន`;
}

// ─── URL Utilities ────────────────────────────────────────────────────────────

/**
 * Build a clean article URL in the format: /post/{id}-{slug}
 * The ID is used for fetching; the slug is cosmetic/SEO.
 *
 * For non-ASCII slugs (Khmer, etc.), we use ID-only URLs to avoid
 * ugly percent-encoded strings when the URL is copied or shared.
 *   - Khmer:   /post/5643          (clean, short)
 *   - English: /post/5726-breaking-news (readable + SEO)
 */
export function buildPostUrl(id: number, slug: string): string {
  const trimmedSlug = slug?.trim();
  if (!trimmedSlug) return `/post/${id}`;

  let decodedSlug = trimmedSlug;
  try {
    decodedSlug = decodeURIComponent(trimmedSlug);
  } catch {
    decodedSlug = trimmedSlug;
  }

  // If slug contains ANY non-ASCII character (after decoding), use ID only
  // eslint-disable-next-line no-control-regex
  if (/[^\x00-\x7F]/.test(decodedSlug)) return `/post/${id}`;

  return `/post/${id}-${trimmedSlug}`;
}

/**
 * Parse an idSlug route parameter into { id, slug }.
 * Supports:
 *   "5726-breaking-news"  → { id: 5726, slug: "breaking-news" }
 *   "5726"                → { id: 5726, slug: "" }
 *   "some-old-slug"       → null (no numeric ID prefix)
 */
export function parseIdSlug(
  idSlug: string
): { id: number; slug: string } | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(idSlug);
  } catch {
    decoded = idSlug;
  }

  // Match: starts with one or more digits, optionally followed by dash + rest
  const match = decoded.match(/^(\d+)(?:-(.+))?$/);
  if (!match) return null;

  const id = parseInt(match[1], 10);
  if (!Number.isFinite(id) || id <= 0) return null;

  return { id, slug: match[2] || "" };
}
