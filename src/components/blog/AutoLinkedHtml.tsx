'use client';

import { useEffect, useState, useMemo } from 'react';
import { useLocale } from 'next-intl';

interface LinkableItem {
  type: string;
  slug: string;
  name: string;
  href: string;
}

/**
 * Renders HTML content with auto-injected internal links.
 * Fetches all linkable entities (beaches, restaurants, villages, etc.)
 * and replaces first mention of each name with a colored <a> link.
 * Avoids linking inside existing <a> tags or HTML attributes.
 */
export function AutoLinkedHtml({ html, className }: { html: string; className?: string }) {
  const locale = useLocale();
  const [linkables, setLinkables] = useState<LinkableItem[]>([]);

  useEffect(() => {
    fetch('/api/linkables')
      .then(r => r.json())
      .then((data: Array<{ type: string; slug: string; name_el: string; name_en: string }>) => {
        if (!Array.isArray(data)) return;
        const pathMap: Record<string, string> = {
          beach: 'beaches', restaurant: 'restaurants', activity: 'activities',
          blog: 'blog', area: 'areas', village: 'places', listing: 'listings',
        };
        const items: LinkableItem[] = data
          .map(item => {
            const name = locale === 'el' ? (item.name_el || item.name_en) : (item.name_en || item.name_el);
            return {
              type: item.type,
              slug: item.slug,
              name,
              href: `/${locale}/${pathMap[item.type] || item.type}/${item.slug}`,
            };
          })
          .filter(item => item.name.length >= 3);
        // Sort by name length descending so longer names match first
        items.sort((a, b) => b.name.length - a.name.length);
        setLinkables(items);
      })
      .catch(() => {});
  }, [locale]);

  const processedHtml = useMemo(() => {
    if (!html || linkables.length === 0) return html;

    // Split HTML into tags and text segments
    // This ensures we only modify text content, not HTML tags/attributes
    const segments = html.split(/(<[^>]+>)/g);
    let insideAnchor = 0; // depth counter for nested <a> tags
    const linkedNames = new Set<string>(); // track already linked names (first occurrence only)
    // Max links to inject to keep it natural
    const MAX_LINKS = 15;
    let linkCount = 0;

    const result = segments.map(segment => {
      // Check if this is an HTML tag
      if (segment.startsWith('<')) {
        const tagLower = segment.toLowerCase();
        if (tagLower.startsWith('<a ') || tagLower.startsWith('<a>')) insideAnchor++;
        if (tagLower.startsWith('</a')) insideAnchor = Math.max(0, insideAnchor - 1);
        return segment;
      }

      // Skip text inside <a> tags or if we've hit max links
      if (insideAnchor > 0 || linkCount >= MAX_LINKS) return segment;

      // Skip if segment is too short (whitespace, punctuation)
      if (segment.trim().length < 3) return segment;

      let text = segment;

      for (const item of linkables) {
        if (linkedNames.has(item.name) || linkCount >= MAX_LINKS) continue;

        const escaped = item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Unicode-aware word boundary: not preceded/followed by a letter
        const regex = new RegExp(`(?<![\\p{L}])${escaped}(?![\\p{L}])`, 'iu');
        const match = text.match(regex);

        if (match && match.index !== undefined) {
          const typeColors: Record<string, string> = {
            beach: 'color:#0891b2',      // cyan-600
            restaurant: 'color:#dc2626', // red-600
            activity: 'color:#d97706',   // amber-600
            area: 'color:#0d6efd',       // primary
            blog: 'color:#4f46e5',       // indigo-600
            village: 'color:#059669',    // emerald-600
            listing: 'color:#0d6efd',    // primary
          };
          const style = typeColors[item.type] || 'color:#0d6efd';
          const link = `<a href="${item.href}" style="${style};text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;font-weight:500" title="${item.type}: ${item.name}">${match[0]}</a>`;

          text = text.slice(0, match.index) + link + text.slice(match.index + match[0].length);
          linkedNames.add(item.name);
          linkCount++;
        }
      }

      return text;
    });

    return result.join('');
  }, [html, linkables]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: processedHtml || html }}
    />
  );
}
