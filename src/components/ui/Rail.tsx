'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal, swipeable row of cards with snap points. On touch screens it is
 * a plain scroller; on larger screens two round buttons page through it.
 * Children are rendered on the server, so the cards stay in the HTML.
 */
export function Rail({
  children, prevLabel, nextLabel, itemClassName = 'w-[78vw] sm:w-[22rem]',
}: {
  children: React.ReactNode[];
  prevLabel: string;
  nextLabel: string;
  itemClassName?: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };
  const button = 'hidden size-11 items-center justify-center rounded-full bg-white text-sea-900 shadow-md ring-1 ring-slate-200 transition hover:scale-105 hover:bg-sea-50 sm:flex';
  return (
    <div className="relative">
      <ul
        ref={track}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:gap-5 sm:px-6"
      >
        {children.map((child, i) => (
          <li key={i} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={() => page(-1)} aria-label={prevLabel} className={button}>
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => page(1)} aria-label={nextLabel} className={button}>
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
