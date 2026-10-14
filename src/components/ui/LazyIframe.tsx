'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * An iframe that is only created once its box actually enters the viewport.
 * `loading="lazy"` alone starts the OpenStreetMap embed (~300 KB of script)
 * while the page is still painting, because browsers load lazy iframes well
 * before they scroll into view; that cost LCP on listing and monastery pages.
 */
export function LazyIframe({ src, title, className }: { src: string; title: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el || show) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setShow(true);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [show]);
  return (
    <div ref={box} className={className}>
      {show && <iframe title={title} src={src} className="size-full border-0" referrerPolicy="no-referrer" />}
    </div>
  );
}
