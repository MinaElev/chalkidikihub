import type { Locale } from '@/i18n/config';

/**
 * Event venues in every language. The database has one Greek `venue` column,
 * which showed "Ιστορικό κέντρο Αφύτου" on English and Russian pages.
 * Place names are transliterated, not translated.
 */
export const EVENT_VENUES: Record<string, Record<Locale, string>> = {
  'food-art-festival-psakoudia': { el: 'Παραλία Ψακουδίων', en: 'Psakoudia beach', de: 'Strand von Psakoudia', ro: 'Plaja Psakoudia', bg: 'Плажът на Псакудя', sr: 'Plaža Psakudija', ru: 'Пляж Псакудья' },
  'festival-afytou': { el: 'Ιστορικό κέντρο Αφύτου', en: 'Afytos old village', de: 'Historischer Ortskern von Afytos', ro: 'Centrul istoric din Afytos', bg: 'Историческият център на Афитос', sr: 'Istorijski centar Afitosa', ru: 'Исторический центр Афитоса' },
  'kangeleftos-ierissou': { el: 'Μαύρο Αλώνι', en: 'Mavro Aloni', de: 'Mavro Aloni', ro: 'Mavro Aloni', bg: 'Мавро Алони', sr: 'Mavro Aloni', ru: 'Мавро Алони' },
  'panigiria-dekapentavgoustou': { el: 'Πλατείες χωριών και εκκλησίες', en: 'Village squares and churches', de: 'Dorfplätze und Kirchen', ro: 'Piețele satelor și bisericile', bg: 'Селски площади и църкви', sr: 'Seoski trgovi i crkve', ru: 'Сельские площади и церкви' },
  'afanos-metagitsi': { el: 'Κεντρική πλατεία', en: 'Main square', de: 'Hauptplatz', ro: 'Piața centrală', bg: 'Централният площад', sr: 'Glavni trg', ru: 'Центральная площадь' },
  'festival-kassandras': { el: 'Αμφιθέατρο Σίβηρης', en: 'Siviri amphitheatre', de: 'Amphitheater von Siviri', ro: 'Amfiteatrul din Siviri', bg: 'Амфитеатърът в Сивири', sr: 'Amfiteatar u Siviriju', ru: 'Амфитеатр в Сивири' },
  'sani-festival': { el: 'Λόφος του Πύργου της Σάνης', en: 'Sani Tower hill', de: 'Hügel des Turms von Sani', ro: 'Dealul Turnului din Sani', bg: 'Хълмът на кулата в Сани', sr: 'Brdo kule u Saniju', ru: 'Холм башни Сани' },
};

/** Events held across the region: no single village is named for them. */
export const REGION_WIDE_EVENTS = new Set(['panigiria-dekapentavgoustou']);

export const eventVenue = (slug: string, locale: Locale, stored?: string | null) =>
  EVENT_VENUES[slug]?.[locale] ?? (locale === 'el' ? stored ?? '' : '');
