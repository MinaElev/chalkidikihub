'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { optimizedImage } from '@/lib/image-url';

export type Photo = { url: string; alt: string };
export type GalleryLabels = { close: string; previous: string; next: string };

/**
 * A large cover plus a scroll-snap strip; any photo opens a full-screen viewer
 * on the page (arrows, swipe, keyboard). Before, a tap opened the raw image in
 * a new tab and the visitor left the stay's page. Without JavaScript the
 * photos are still plain links to the image.
 * Only the cover is a priority (LCP) image; the rest lazy-load.
 */
export function Gallery({ photos, label, labels }: { photos: Photo[]; label: string; labels: GalleryLabels }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!photos.length) return null;
  const [cover, ...rest] = photos;

  const show = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(i);
  };

  return (
    <section aria-label={label} className="space-y-3">
      <a href={cover.url} onClick={show(0)} aria-label={`${label} 1 / ${photos.length}`} className="relative block aspect-[16/10] cursor-zoom-in overflow-hidden rounded-3xl bg-sand-100 sm:aspect-[21/9]">
        <Image src={cover.url} alt={cover.alt} fill priority fetchPriority="high" sizes="(min-width: 1280px) 1232px, 100vw" className="object-cover" />
        {photos.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white">1 / {photos.length}</span>
        )}
      </a>
      {rest.length > 0 && (
        <ul className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
          {rest.map((p, i) => (
            <li key={p.url} className="relative aspect-[4/3] w-60 shrink-0 snap-start overflow-hidden rounded-2xl bg-sand-100 sm:w-72">
              <a href={p.url} onClick={show(i + 1)} aria-label={`${label} ${i + 2} / ${photos.length}`} className="block size-full cursor-zoom-in">
                <Image src={p.url} alt={p.alt} fill sizes="288px" className="object-cover" />
              </a>
            </li>
          ))}
        </ul>
      )}
      {open !== null && <Viewer photos={photos} start={open} label={label} labels={labels} onClose={() => setOpen(null)} />}
    </section>
  );
}

function Viewer({ photos, start, label, labels, onClose }: { photos: Photo[]; start: number; label: string; labels: GalleryLabels; onClose: () => void }) {
  const [i, setI] = useState(start);
  const n = photos.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [go, onClose]);

  // Sized to the screen (and its pixel density), capped at 1920px wide.
  const src = (k: number) => optimizedImage(photos[k].url, Math.min(1920, Math.ceil(window.innerWidth * (window.devicePixelRatio || 1))), 65);
  const nav = 'absolute top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${label} ${i + 1} / ${n}`}
      className="fixed inset-0 z-[70] flex flex-col bg-black/95"
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm font-medium tabular-nums">{i + 1} / {n}</span>
        <button ref={closeBtn} type="button" onClick={onClose} aria-label={labels.close} className="flex size-11 items-center justify-center rounded-full hover:bg-white/15">
          <X className="size-6" aria-hidden />
        </button>
      </div>
      {/* Clicking the dark area around the photo closes the viewer, like most galleries. */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- full-screen view; next/image's fill/sizes model adds nothing here */}
        <img key={i} src={src(i)} alt={photos[i].alt} className="max-h-full max-w-full rounded-lg object-contain" />
        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={labels.previous} className={`${nav} left-3`}><ChevronLeft className="size-7" aria-hidden /></button>
            <button type="button" onClick={() => go(1)} aria-label={labels.next} className={`${nav} right-3`}><ChevronRight className="size-7" aria-hidden /></button>
            {/* Warm the neighbours so swiping feels instant. */}
            <link rel="prefetch" as="image" href={src((i + 1) % n)} />
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
