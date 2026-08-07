"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface BookPreviewCarouselProps {
  bookTitle: string;
  previewUrls?: string[];
  pageCount?: number;
}

const DEFAULT_COVER = "/images/default_cover.jpg";

export default function BookPreviewCarousel({
  bookTitle,
  previewUrls = [],
  pageCount,
}: BookPreviewCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Fallback to the default cover image if previewUrls is not passed,
  // otherwise resolve total count and array from previewUrls.
  const resolvedUrls =
    previewUrls.length > 0
      ? previewUrls
      : Array.from({ length: pageCount ?? 5 }, () => DEFAULT_COVER);

  const totalPages = resolvedUrls.length;

  const goTo = useCallback(
    (index: number) => {
      if (totalPages === 0) return;
      const clamped = ((index % totalPages) + totalPages) % totalPages;
      setActiveIndex(clamped);
    },
    [totalPages],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (lightboxOpen) {
        if (e.key === "Escape") setLightboxOpen(false);
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, next, prev]);

  // Touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta > 0 ? prev() : next();
    }
    touchStartX.current = null;
  }

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto select-none">
      {/* Preview title */}
      <h2 className="text-base font-semibold text-neutral-900 mb-1 truncate">
        {bookTitle}
      </h2>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-neutral-600">
          Preview · Page {activeIndex + 1} of {totalPages}
        </h3>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
          aria-label="View full size"
        >
          <ZoomIn size={16} />
          Zoom
        </button>
      </div>

      {/* Main viewport */}
      <div
        className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm ring-1 ring-neutral-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {resolvedUrls.map((url, i) => (
            <div key={`${url}-${i}`} className="relative h-full w-full shrink-0">
              <Image
                src={url}
                alt={`${bookTitle} — preview page ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        {totalPages > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous page"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors shadow"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next page"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors shadow"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {resolvedUrls.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex
                  ? "w-5 bg-neutral-800"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {totalPages > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {resolvedUrls.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => goTo(i)}
              className={`relative aspect-3/4 overflow-hidden rounded-md ring-2 transition-all ${
                i === activeIndex
                  ? "ring-neutral-800"
                  : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt={`${bookTitle} — thumbnail page ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close preview"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>

          {totalPages > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous page"
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div
            className="relative h-[85vh] w-auto max-w-3xl aspect-3/4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={resolvedUrls[activeIndex]}
              alt={`${bookTitle} — preview page ${activeIndex + 1}, full size`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {totalPages > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next page"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}