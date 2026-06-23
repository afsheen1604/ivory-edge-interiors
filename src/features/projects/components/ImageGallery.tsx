import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectImage } from "@/features/projects/types/project";

interface ImageGalleryProps {
  images: ProjectImage[];
}

/**
 * Grid of gallery images (image_type = 'gallery' only — before/after pairs
 * render separately via BeforeAfterGallery). Clicking any thumbnail opens a
 * full-screen lightbox with prev/next navigation and keyboard support.
 */
export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  function close() {
    setActiveIndex(null);
  }

  function showPrev() {
    setActiveIndex((current) => (current === null ? null : (current - 1 + images.length) % images.length));
  }

  function showNext() {
    setActiveIndex((current) => (current === null ? null : (current + 1) % images.length));
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group aspect-square overflow-hidden rounded-md bg-ivory-200"
            aria-label={`View image ${index + 1} of ${images.length}${image.caption ? `: ${image.caption}` : ""}`}
          >
            <img
              src={image.image_url}
              alt={image.caption ?? ""}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-400/95 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "ArrowRight") showNext();
          }}
          tabIndex={-1}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 text-ivory-100 hover:text-gold-300"
          >
            <X className="h-7 w-7" aria-hidden="true" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous image"
              className="absolute left-4 text-ivory-100 hover:text-gold-300 sm:left-8"
            >
              <ChevronLeft className="h-9 w-9" aria-hidden="true" />
            </button>
          )}

          <img
            src={images[activeIndex]?.image_url}
            alt={images[activeIndex]?.caption ?? ""}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next image"
              className="absolute right-4 text-ivory-100 hover:text-gold-300 sm:right-8"
            >
              <ChevronRight className="h-9 w-9" aria-hidden="true" />
            </button>
          )}

          <p className="absolute bottom-6 font-body text-sm text-ivory-200">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
