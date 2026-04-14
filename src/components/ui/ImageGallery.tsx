'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';

interface ImageGalleryProps {
  images: Array<{ id: string; image_url: string; is_cover?: boolean }>;
  alt?: string;
}

export function ImageGallery({ images, alt = '' }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
        <span className="text-primary-400 text-6xl font-bold">H</span>
      </div>
    );
  }

  const cover = images.find((img) => img.is_cover) || images[0];

  function openLightbox(index: number) {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }

  function prev() {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }

  return (
    <>
      {/* Main image + thumbnails */}
      <div>
        {/* Cover image */}
        <div
          className="relative aspect-[16/9] bg-gray-200 rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(images.indexOf(cover))}
        >
          <Image src={cover.image_url} alt={alt} fill priority sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium text-gray-700">
              <Expand className="w-4 h-4" />
              {images.length > 1 ? `Δείτε ${images.length} φωτογραφίες` : 'Μεγέθυνση'}
            </div>
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              1/{images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => openLightbox(idx)}
                className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                  idx === 0 ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image src={img.image_url} alt="" width={80} height={56} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image - lazy loaded so lightbox doesn't block page load */}
          <Image
            src={images[currentIndex].image_url}
            alt={alt}
            width={1200}
            height={800}
            loading="lazy"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
