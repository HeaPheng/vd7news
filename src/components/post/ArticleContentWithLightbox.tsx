"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
    html: string;
};

export default function ArticleContentWithLightbox({ html }: Props) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const imageSources = useMemo(() => {
        if (typeof window === "undefined") return [];

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        return Array.from(doc.querySelectorAll("img"))
            .map((img) => img.getAttribute("src") || "")
            .filter(Boolean);
    }, [html]);

    const selectedImage =
        selectedIndex !== null ? imageSources[selectedIndex] : null;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;

            if (e.key === "Escape") {
                setSelectedIndex(null);
            }

            if (e.key === "ArrowRight" && imageSources.length > 1) {
                setSelectedIndex((prev) =>
                    prev === null ? 0 : (prev + 1) % imageSources.length
                );
            }

            if (e.key === "ArrowLeft" && imageSources.length > 1) {
                setSelectedIndex((prev) =>
                    prev === null
                        ? 0
                        : (prev - 1 + imageSources.length) % imageSources.length
                );
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, imageSources.length]);

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;

        if (target.tagName !== "IMG") return;

        const img = target as HTMLImageElement;
        if (!img.src) return;

        const clickedIndex = imageSources.findIndex((src) => src === img.src);
        if (clickedIndex !== -1) {
            setSelectedIndex(clickedIndex);
        }
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
    };

    const showPrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (imageSources.length <= 1) return;

        setSelectedIndex((prev) =>
            prev === null ? 0 : (prev - 1 + imageSources.length) % imageSources.length
        );
    };

    const showNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (imageSources.length <= 1) return;

        setSelectedIndex((prev) =>
            prev === null ? 0 : (prev + 1) % imageSources.length
        );
    };

    return (
        <>
            <div
                onClick={handleContentClick}
                className="
          article-content mt-8 max-w-none
          prose prose-invert
          prose-p:text-white/85
          prose-headings:text-white
          prose-strong:text-white
          prose-a:text-red-400
          prose-li:text-white/85
          prose-img:cursor-zoom-in
          prose-img:rounded-2xl
          prose-img:shadow-lg
        "
                dangerouslySetInnerHTML={{ __html: html }}
            />

            {selectedImage && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={closeLightbox}
                >
                    {/* Image wrapper */}
                    <div
                        className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image */}
                        <img
                            src={selectedImage}
                            alt={`Article image ${selectedIndex! + 1}`}
                            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                        />

                        {/* Close */}
                        <button
                            onClick={closeLightbox}
                            className="absolute -top-3 -right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-lg text-white shadow-lg transition hover:bg-red-600"
                        >
                            ×
                        </button>

                        {/* Prev */}
                        {imageSources.length > 1 && (
                            <button
                                onClick={showPrev}
                                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-xl text-white shadow-md transition hover:bg-red-600"
                            >
                                ‹
                            </button>
                        )}

                        {/* Next */}
                        {imageSources.length > 1 && (
                            <button
                                onClick={showNext}
                                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-xl text-white shadow-md transition hover:bg-red-600"
                            >
                                ›
                            </button>
                        )}

                        {/* Counter */}
                        {imageSources.length > 1 && selectedIndex !== null && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs text-white shadow-md">
                                {selectedIndex + 1} / {imageSources.length}
                            </div>
                        )}
                    </div>
                </div>
            )}

        </>
    );
}