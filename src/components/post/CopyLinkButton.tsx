"use client";

export default function CopyLinkButton({ url }: { url: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback: silent fail
    }
  };

  return (
    <button
      onClick={copy}
      className="share-btn inline-flex items-center justify-center"
      aria-label="Copy link"
      type="button"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2" fill="#64748b" />
        <rect
          x="4"
          y="4"
          width="11"
          height="11"
          rx="2"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.15"
        />
        <rect
          x="9"
          y="9"
          width="11"
          height="11"
          rx="2"
          fill="none"
          stroke="#475569"
          strokeWidth="1.15"
        />
      </svg>
    </button>
  );
}
