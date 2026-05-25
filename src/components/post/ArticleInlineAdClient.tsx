"use client";

import Link from "next/link";

export type InlineAdData = {
  id: number;
  title: string;
  image: string;
  targetUrl: string;
  openInNewTab: boolean;
};

type Props = {
  ad: InlineAdData;
};

export default function ArticleInlineAdClient({ ad }: Props) {
  if (!ad.image) return null;

  return (
    <div className="my-6 -mx-3 sm:-mx-8 lg:-mx-10 md:hidden">
      <Link
        href={ad.targetUrl || "#"}
        target={ad.openInNewTab ? "_blank" : undefined}
        rel={ad.openInNewTab ? "noopener noreferrer" : undefined}
        className="group relative block overflow-hidden"
      >
        <img
          src={ad.image}
          alt={ad.title}
          className="block w-full object-cover transition-transform duration-300 group-hover:scale-[1.01] group-active:scale-[0.99]"
        />
      </Link>
    </div>
  );
}
