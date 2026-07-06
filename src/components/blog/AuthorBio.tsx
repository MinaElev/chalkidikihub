'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ExternalLink } from 'lucide-react';
import { getAuthor, authorUrl, authorInitials } from '@/lib/authors';

// E-E-A-T visible byline at the end of every article. Renders the named editor
// (resolved from the stored `authorUsername`) with Person microdata, linking to
// their /authors/<username> profile — the schema author URL and the visible
// link resolve to the same real, transparent author page.
type Props = {
  authorUsername?: string;
  publishedAt?: string;
  updatedAt?: string;
};

const COPY: Record<string, { eyebrow: string; aboutLink: string; publishedLabel: string; updatedLabel: string }> = {
  el: { eyebrow: 'Γράφει', aboutLink: 'Όλα τα άρθρα του συντάκτη', publishedLabel: 'Δημοσιεύτηκε', updatedLabel: 'Ενημερώθηκε' },
  en: { eyebrow: 'Written by', aboutLink: 'All articles by this editor', publishedLabel: 'Published', updatedLabel: 'Updated' },
  de: { eyebrow: 'Geschrieben von', aboutLink: 'Alle Artikel dieses Redakteurs', publishedLabel: 'Veröffentlicht', updatedLabel: 'Aktualisiert' },
  bg: { eyebrow: 'Написано от', aboutLink: 'Всички статии на този редактор', publishedLabel: 'Публикувано', updatedLabel: 'Обновено' },
  ru: { eyebrow: 'Автор', aboutLink: 'Все статьи этого редактора', publishedLabel: 'Опубликовано', updatedLabel: 'Обновлено' },
  ro: { eyebrow: 'Scris de', aboutLink: 'Toate articolele acestui editor', publishedLabel: 'Publicat', updatedLabel: 'Actualizat' },
  sr: { eyebrow: 'Napisao', aboutLink: 'Svi članci ovog urednika', publishedLabel: 'Objavljeno', updatedLabel: 'Ažurirano' },
};

function formatDate(iso: string | undefined, locale: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(locale === 'el' ? 'el-GR' : locale, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso.slice(0, 10);
  }
}

export function AuthorBio({ authorUsername, publishedAt, updatedAt }: Props) {
  const locale = useLocale();
  const t = COPY[locale] || COPY.el;
  const author = getAuthor(authorUsername);
  const role = author.role[locale] || author.role.en;
  const bio = author.bio[locale] || author.bio.en;
  const showUpdated = updatedAt && publishedAt && updatedAt.slice(0, 10) !== publishedAt.slice(0, 10);

  return (
    <aside
      className="mt-10 mb-2 rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-5 sm:p-6"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="flex items-start gap-4">
        <Link href={authorUrl(author.username)} className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${author.avatarGradient} text-white flex items-center justify-center shadow-sm font-bold text-lg sm:text-xl`}>
          {authorInitials(author.name)}
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-primary-700 font-semibold">{t.eyebrow}</p>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
            <Link href={authorUrl(author.username)} className="hover:underline" itemProp="name">{author.name}</Link>
          </h3>
          <p className="text-sm font-medium text-primary-700" itemProp="jobTitle">{role}</p>
          <p className="text-sm text-gray-700 leading-relaxed mt-2" itemProp="description">{bio}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href={authorUrl(author.username)} className="inline-flex items-center gap-1 text-primary-700 hover:text-primary-900 font-medium hover:underline">
              <ExternalLink className="w-4 h-4" />
              {t.aboutLink}
            </Link>
          </div>

          {(publishedAt || updatedAt) && (
            <div className="mt-3 pt-3 border-t border-primary-100 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
              {publishedAt && (
                <span>{t.publishedLabel}: <time dateTime={publishedAt}>{formatDate(publishedAt, locale)}</time></span>
              )}
              {showUpdated && (
                <span>{t.updatedLabel}: <time dateTime={updatedAt}>{formatDate(updatedAt, locale)}</time></span>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
