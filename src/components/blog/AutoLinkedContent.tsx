'use client';

import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface LinkableItem {
  type: 'beach' | 'restaurant' | 'activity' | 'area' | 'blog' | 'listing' | 'village';
  slug: string;
  name: string;
  href: string;
}

export function AutoLinkedContent({ content, className }: { content: string; className?: string }) {
  const locale = useLocale();
  const [linkables, setLinkables] = useState<LinkableItem[]>([]);

  // Fetch linkable items from lightweight API (single request instead of 5)
  useEffect(() => {
    fetch('/api/linkables')
      .then(r => r.json())
      .then((data: Array<{ type: string; slug: string; name_el: string; name_en: string }>) => {
        if (!Array.isArray(data)) return;
        const pathMap: Record<string, string> = { beach: 'beaches', restaurant: 'restaurants', activity: 'activities', blog: 'blog', area: 'areas', village: 'places' };
        const items: LinkableItem[] = data
          .map(item => {
            const name = locale === 'el' ? (item.name_el || item.name_en) : (item.name_en || item.name_el);
            return { type: item.type as LinkableItem['type'], slug: item.slug, name, href: `/${pathMap[item.type] || item.type}/${item.slug}` };
          })
          .filter(item => item.name.length >= 3);
        items.sort((a, b) => b.name.length - a.name.length);
        setLinkables(items);
      })
      .catch(() => {});
  }, [locale]);

  // Regex for inline images: ![alt text](url)
  const imageRegex = /^!\[([^\]]*)\]\(([^)]+)\)$/;

  // Process content into paragraphs with auto-links
  const processedParagraphs = useMemo(() => {
    if (!content || linkables.length === 0) return null;

    return content.split('\n').map((paragraph, idx) => {
      const imgMatch = paragraph.trim().match(imageRegex);
      if (imgMatch) {
        return { type: 'image' as const, text: imgMatch[1], url: imgMatch[2], key: idx };
      }
      if (paragraph.startsWith('### ')) {
        return { type: 'subheading' as const, text: paragraph.replace('### ', ''), key: idx };
      }
      if (paragraph.startsWith('## ')) {
        return { type: 'heading' as const, text: paragraph.replace('## ', ''), key: idx };
      }
      if (paragraph.startsWith('- ')) {
        return { type: 'list' as const, text: paragraph.replace('- ', ''), key: idx };
      }
      if (paragraph.trim() === '') {
        return { type: 'space' as const, text: '', key: idx };
      }
      return { type: 'paragraph' as const, text: paragraph, key: idx };
    });
  }, [content, linkables]);

  function renderWithLinks(text: string) {
    if (linkables.length === 0) return text;

    // Track which positions are already linked to avoid overlapping
    const linked = new Set<number>();
    const parts: Array<{ start: number; end: number; item: LinkableItem } | { start: number; end: number; text: string }> = [];

    // Find all matches
    const matches: Array<{ start: number; end: number; item: LinkableItem }> = [];
    for (const item of linkables) {
      // \b doesn't work with Greek characters, use lookaround with spaces/punctuation/start/end
      const escaped = escapeRegex(item.name);
      const regex = new RegExp(`(?<![\\p{L}])${escaped}(?![\\p{L}])`, 'giu');
      let match;
      while ((match = regex.exec(text)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        // Check no overlap
        let overlaps = false;
        for (let i = start; i < end; i++) {
          if (linked.has(i)) { overlaps = true; break; }
        }
        if (!overlaps) {
          matches.push({ start, end, item });
          for (let i = start; i < end; i++) linked.add(i);
          break; // Only first match per item
        }
      }
    }

    if (matches.length === 0) return text;

    // Sort by position
    matches.sort((a, b) => a.start - b.start);

    // Build parts
    const result: React.ReactNode[] = [];
    let lastEnd = 0;

    matches.forEach((m, i) => {
      // Text before match
      if (m.start > lastEnd) {
        result.push(text.slice(lastEnd, m.start));
      }
      // Linked text
      const typeColors: Record<string, string> = {
        beach: 'text-cyan-600 hover:text-cyan-800',
        restaurant: 'text-red-600 hover:text-red-800',
        activity: 'text-amber-600 hover:text-amber-800',
        area: 'text-primary-600 hover:text-primary-800',
        blog: 'text-indigo-600 hover:text-indigo-800',
        listing: 'text-primary-600 hover:text-primary-800',
      };
      result.push(
        <Link
          key={`link-${i}`}
          href={m.item.href}
          className={`underline decoration-dotted underline-offset-2 font-medium ${typeColors[m.item.type] || 'text-primary-600'}`}
          title={`${m.item.type}: ${m.item.name}`}
        >
          {text.slice(m.start, m.end)}
        </Link>
      );
      lastEnd = m.end;
    });

    // Remaining text
    if (lastEnd < text.length) {
      result.push(text.slice(lastEnd));
    }

    return <>{result}</>;
  }

  if (!processedParagraphs) {
    // Fallback: render without links while loading
    return (
      <div className={className}>
        {content.split('\n').map((p, i) => {
          const imgMatch = p.trim().match(imageRegex);
          if (imgMatch) return <figure key={i} className="my-6"><div className="relative aspect-[16/9] w-full"><Image src={imgMatch[2]} alt={imgMatch[1]} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover rounded-xl" /></div>{imgMatch[1] && <figcaption className="text-sm text-gray-500 text-center mt-2">{imgMatch[1]}</figcaption>}</figure>;
          if (p.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-gray-800 mt-4 mb-1">{p.replace('### ', '')}</h3>;
          if (p.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{p.replace('## ', '')}</h2>;
          if (p.startsWith('- ')) return <div key={i} className="flex gap-2 ml-4 mb-2"><span className="text-primary-600">•</span><p className="text-gray-600">{p.replace('- ', '')}</p></div>;
          if (p.trim() === '') return <div key={i} className="h-2" />;
          return <p key={i} className="text-gray-600 leading-relaxed mb-4">{p}</p>;
        })}
      </div>
    );
  }

  return (
    <div className={className}>
      {processedParagraphs.map((p) => {
        if (p.type === 'image') return <figure key={p.key} className="my-6"><div className="relative aspect-[16/9] w-full"><Image src={(p as { url: string }).url} alt={p.text} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover rounded-xl" /></div>{p.text && <figcaption className="text-sm text-gray-500 text-center mt-2">{p.text}</figcaption>}</figure>;
        if (p.type === 'subheading') return <h3 key={p.key} className="text-base font-bold text-gray-800 mt-4 mb-1">{renderWithLinks(p.text)}</h3>;
        if (p.type === 'heading') return <h2 key={p.key} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{renderWithLinks(p.text)}</h2>;
        if (p.type === 'list') return <div key={p.key} className="flex gap-2 ml-4 mb-2"><span className="text-primary-600">•</span><p className="text-gray-600">{renderWithLinks(p.text)}</p></div>;
        if (p.type === 'space') return <div key={p.key} className="h-2" />;
        return <p key={p.key} className="text-gray-600 leading-relaxed mb-4">{renderWithLinks(p.text)}</p>;
      })}
    </div>
  );
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
