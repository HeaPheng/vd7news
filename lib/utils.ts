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
