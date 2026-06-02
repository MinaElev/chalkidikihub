'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mail, ExternalLink, PenLine } from 'lucide-react';

// E-E-A-T visible byline at the end of every article. Backed by the about
// page (linked via "See more") so the schema author URL and the visible
// link both resolve to a real, transparent author description.
type Props = {
  authorName?: string;
  publishedAt?: string;
  updatedAt?: string;
};

const TEAM_NAME = 'ChalkidikiHub Writer Team';

const COPY: Record<string, {
  eyebrow: string;
  intro: string;
  emailLabel: string;
  aboutLink: string;
  publishedLabel: string;
  updatedLabel: string;
}> = {
  el: {
    eyebrow: 'Γράφει',
    intro: 'Η συντακτική ομάδα του ChalkidikiHub: Έλληνες που έχουν επισκεφτεί κάθε χωριό, παραλία και ταβέρνα της Χαλκιδικής. Γράφουμε με βάση πραγματικές εμπειρίες, χωρίς clickbait και χωρίς προμήθειες από booking sites.',
    emailLabel: 'Επικοινωνία',
    aboutLink: 'Σχετικά με εμάς',
    publishedLabel: 'Δημοσιεύτηκε',
    updatedLabel: 'Ενημερώθηκε',
  },
  en: {
    eyebrow: 'Written by',
    intro: 'The ChalkidikiHub editorial team: Greeks who have visited every village, beach and taverna in Halkidiki. We write from real experience, without clickbait and without commissions from booking sites.',
    emailLabel: 'Contact',
    aboutLink: 'About us',
    publishedLabel: 'Published',
    updatedLabel: 'Updated',
  },
  de: {
    eyebrow: 'Geschrieben von',
    intro: 'Das Redaktionsteam von ChalkidikiHub: Griechen, die jedes Dorf, jeden Strand und jede Taverne auf Chalkidiki besucht haben. Wir schreiben aus echter Erfahrung — ohne Clickbait und ohne Provisionen von Buchungsseiten.',
    emailLabel: 'Kontakt',
    aboutLink: 'Über uns',
    publishedLabel: 'Veröffentlicht',
    updatedLabel: 'Aktualisiert',
  },
  bg: {
    eyebrow: 'Написано от',
    intro: 'Редакционният екип на ChalkidikiHub: гърци, посетили всяко село, плаж и таверна в Халкидики. Пишем от реален опит — без clickbait и без комисиони от букинг сайтове.',
    emailLabel: 'Контакт',
    aboutLink: 'За нас',
    publishedLabel: 'Публикувано',
    updatedLabel: 'Обновено',
  },
  ru: {
    eyebrow: 'Автор',
    intro: 'Редакционная команда ChalkidikiHub: греки, побывавшие в каждой деревне, на каждом пляже и в каждой таверне Халкидиков. Пишем из реального опыта — без кликбейта и без комиссий от букинг-сайтов.',
    emailLabel: 'Контакт',
    aboutLink: 'О нас',
    publishedLabel: 'Опубликовано',
    updatedLabel: 'Обновлено',
  },
  ro: {
    eyebrow: 'Scris de',
    intro: 'Echipa editorială ChalkidikiHub: greci care au vizitat fiecare sat, plajă și tavernă din Halkidiki. Scriem din experiență reală — fără clickbait și fără comisioane de la site-urile de rezervări.',
    emailLabel: 'Contact',
    aboutLink: 'Despre noi',
    publishedLabel: 'Publicat',
    updatedLabel: 'Actualizat',
  },
  sr: {
    eyebrow: 'Napisao',
    intro: 'Redakcijski tim ChalkidikiHub-a: Grci koji su posetili svako selo, plažu i tavernu u Halkidikiju. Pišemo iz stvarnog iskustva — bez clickbait-a i bez provizija od booking sajtova.',
    emailLabel: 'Kontakt',
    aboutLink: 'O nama',
    publishedLabel: 'Objavljeno',
    updatedLabel: 'Ažurirano',
  },
};

function formatDate(iso: string | undefined, locale: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(locale === 'el' ? 'el-GR' : locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export function AuthorBio({ publishedAt, updatedAt }: Props) {
  const locale = useLocale();
  const t = COPY[locale] || COPY.el;
  const showUpdated = updatedAt && publishedAt && updatedAt.slice(0, 10) !== publishedAt.slice(0, 10);

  return (
    <aside
      className="mt-10 mb-2 rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-5 sm:p-6"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-sm">
          <PenLine className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-primary-700 font-semibold">{t.eyebrow}</p>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5" itemProp="name">
            {TEAM_NAME}
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed mt-2" itemProp="description">
            {t.intro}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-primary-700 hover:text-primary-900 font-medium hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              {t.aboutLink}
            </Link>
            <a
              href="mailto:mnc@hotmail.gr"
              className="inline-flex items-center gap-1 text-primary-700 hover:text-primary-900 font-medium hover:underline"
            >
              <Mail className="w-4 h-4" />
              {t.emailLabel}
            </a>
          </div>

          {(publishedAt || updatedAt) && (
            <div className="mt-3 pt-3 border-t border-primary-100 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
              {publishedAt && (
                <span>
                  {t.publishedLabel}: <time dateTime={publishedAt}>{formatDate(publishedAt, locale)}</time>
                </span>
              )}
              {showUpdated && (
                <span>
                  {t.updatedLabel}: <time dateTime={updatedAt}>{formatDate(updatedAt, locale)}</time>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
