'use client';

import { useEffect, useState } from 'react';

/**
 * Sticky row of in-page links for an area page (overview, villages, beaches…).
 * Plain anchors in the HTML; after mount the link of the section in view is underlined.
 */
export function AreaTabs({ items, label }: { items: Array<{ id: string; label: string }>; label: string }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const onScroll = () => {
      // The last section whose top has passed a line just under the sticky header and this bar.
      let current = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= 160) current = el.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  return (
    <nav aria-label={label} className="sticky top-16 z-30 -mx-4 mt-6 border-y border-gray-100 bg-white/95 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:shadow-sm">
      <ul className="scrollbar-none flex gap-1 overflow-x-auto px-2 sm:justify-center sm:gap-4">
        {items.map((i) => (
          <li key={i.id} className="shrink-0">
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? 'true' : undefined}
              className={`block border-b-[3px] px-3 py-3.5 text-sm font-semibold transition sm:px-5 sm:text-[15px] ${active === i.id ? 'border-sea-700 text-gray-900' : 'border-transparent text-slate-600 hover:text-sea-700'}`}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
