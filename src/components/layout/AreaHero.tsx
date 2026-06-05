'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { AREAS } from '@/lib/constants';
import { AreaInfo } from '@/types';
import { FormattedText } from '@/components/ui/FormattedText';

// Splits the description into a short lead (rendered as plain text in the
// hero overlay) and the rest (rendered as markdown below). The split point
// is the first blank line OR the first markdown heading — whichever comes
// first. If neither exists, the whole description is treated as the lead.
function splitDescription(text: string): { lead: string; body: string } {
  if (!text) return { lead: '', body: '' };
  const headingIdx = text.search(/(^|\n)#{2,}\s/);
  const blankIdx = text.indexOf('\n\n');
  const candidates = [headingIdx, blankIdx].filter((i) => i >= 0);
  if (candidates.length === 0) return { lead: text.trim(), body: '' };
  const splitAt = Math.min(...candidates);
  return {
    lead: text.slice(0, splitAt).trim(),
    body: text.slice(splitAt).trim(),
  };
}

export function AreaHero({ slug }: { slug: string }) {
  const locale = useLocale();
  const fallback = AREAS.find((a) => a.slug === slug);
  const [area, setArea] = useState<AreaInfo | null>(fallback || null);

  useEffect(() => {
    fetch('/api/areas')
      .then((r) => r.json())
      .then((data: AreaInfo[]) => {
        const found = data.find((a) => a.slug === slug);
        if (found) setArea(found);
      })
      .catch(() => {});
  }, [slug]);

  if (!area) return null;

  const name = area.name[locale] || area.name.el || '';
  const fullDescription = area.description[locale] || area.description.el || '';
  const { lead, body } = splitDescription(fullDescription);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl aspect-[21/9] bg-gray-300 mb-8">
        {area.image_url && (
          <Image src={area.image_url} alt={name} fill priority
            sizes="100vw"
            className="object-cover" />
        )}
        <div className="absolute inset-0 bg-primary-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <h1 className="text-4xl font-bold text-white">{name}</h1>
          {lead && (
            <p className="mt-2 text-lg text-gray-200 max-w-2xl line-clamp-3">{lead}</p>
          )}
        </div>
      </div>
      {body && (
        <section className="max-w-3xl mb-12">
          <FormattedText text={body} />
        </section>
      )}
    </>
  );
}
