/**
 * Country calling codes for the phone fields guests fill in, so owners get
 * numbers they can call or WhatsApp straight away. Names come from
 * Intl.DisplayNames in the visitor's language, so no translations live here.
 */

/** ISO 3166 code → calling code (digits only). */
export const DIAL_CODES: Record<string, string> = {
  // Europe
  GR: '30', CY: '357', DE: '49', AT: '43', CH: '41', GB: '44', IE: '353', FR: '33', BE: '32', NL: '31', LU: '352',
  IT: '39', ES: '34', PT: '351', MT: '356', DK: '45', SE: '46', NO: '47', FI: '358', IS: '354', EE: '372', LV: '371',
  LT: '370', PL: '48', CZ: '420', SK: '421', HU: '36', SI: '386', HR: '385', BA: '387', RS: '381', ME: '382',
  MK: '389', AL: '355', XK: '383', BG: '359', RO: '40', MD: '373', UA: '380', BY: '375', RU: '7', TR: '90',
  GE: '995', AM: '374', AZ: '994', LI: '423', MC: '377', AD: '376', SM: '378',
  // Middle East & Africa
  IL: '972', LB: '961', JO: '962', EG: '20', SA: '966', AE: '971', QA: '974', KW: '965', BH: '973', OM: '968',
  MA: '212', TN: '216', DZ: '213', ZA: '27', NG: '234', KE: '254',
  // Asia & Oceania
  KZ: '7', UZ: '998', IN: '91', PK: '92', CN: '86', JP: '81', KR: '82', SG: '65', TH: '66', PH: '63',
  AU: '61', NZ: '64',
  // Americas
  US: '1', CA: '1', MX: '52', BR: '55', AR: '54', CL: '56', CO: '57',
};

/**
 * Shown first, in this order, for each site language. The first one is the
 * default when the browser names no country; English has none (too varied).
 */
export const SUGGESTED: Record<string, { list: string[]; preselect: boolean }> = {
  el: { list: ['GR', 'CY'], preselect: true },
  en: { list: ['GB', 'IE', 'US', 'CA', 'AU'], preselect: false },
  de: { list: ['DE', 'AT', 'CH'], preselect: true },
  ro: { list: ['RO', 'MD'], preselect: true },
  bg: { list: ['BG'], preselect: true },
  sr: { list: ['RS', 'ME', 'BA'], preselect: true },
  ru: { list: ['RU', 'UA', 'BY', 'KZ', 'MD'], preselect: true },
};

/** Countries whose local numbers keep their leading 0 after the calling code (Italian landlines). */
const KEEP_ZERO = new Set(['IT', 'SM']);

/**
 * The country of the browser's main language ("de-AT" → AT), if it names one
 * we know. Only the first language counts: later ones are often leftovers like
 * "en-US", and "en-US" itself is the default of countless European browsers,
 * so it says nothing about where the visitor lives.
 */
export function browserCountry(): string | null {
  if (typeof navigator === 'undefined') return null;
  const tag = navigator.languages?.[0] ?? navigator.language;
  if (!tag || /^en-US$/i.test(tag)) return null;
  const region = tag.split('-').find((p, i) => i > 0 && /^[A-Za-z]{2}$/.test(p))?.toUpperCase();
  return region && DIAL_CODES[region] ? region : null;
}

/**
 * The country of a number typed with its own code ("+44 7700…", "0049…"), or
 * null. Codes shared by several countries (+1, +7) keep `current` if it fits.
 */
export function dialCountry(raw: string, current: string): string | null {
  const t = raw.trim();
  if (!t.startsWith('+') && !t.startsWith('00')) return null;
  const digits = t.startsWith('00') ? t.replace(/\D/g, '').slice(2) : t.replace(/\D/g, '');
  let best: string | null = null;
  for (const [c, code] of Object.entries(DIAL_CODES)) {
    if (!digits.startsWith(code)) continue;
    if (!best || code.length > DIAL_CODES[best].length || (code === DIAL_CODES[best] && c === current)) best = c;
  }
  return best;
}

/**
 * The number as the owner should get it: international (+…) when we can tell.
 * A number the visitor typed with + or 00 is kept as typed; otherwise the
 * chosen country's code goes in front and the trunk 0 is dropped.
 */
export function internationalPhone(raw: string, country: string): string {
  const typed = raw.trim();
  if (!typed) return '';
  const digits = typed.replace(/[^\d]/g, '');
  if (typed.startsWith('+')) return `+${digits}`;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  const code = DIAL_CODES[country];
  if (!code) return typed;
  const local = KEEP_ZERO.has(country) ? digits : digits.replace(/^0+/, '');
  // Typed with the code but without + (e.g. "306912345678"): don't add it twice.
  if (local.startsWith(code) && local.length > code.length + 8) return `+${local}`;
  return `+${code}${local}`;
}

/**
 * The owner's number as WhatsApp wants it (digits with country code), or null
 * when it can't be a mobile: owners are Greek, so a bare 69… gets +30, and a
 * Greek landline (2…) is left out.
 */
export function whatsappNumber(raw: string): string | null {
  let d = raw.replace(/[^\d+]/g, '');
  if (d.startsWith('00')) d = `+${d.slice(2)}`;
  if (!d.startsWith('+')) d = /^69\d{8}$/.test(d) ? `+30${d}` : /^3069\d{8}$/.test(d) ? `+${d}` : '';
  const digits = d.replace(/\D/g, '');
  if (!digits || digits.length < 8 || digits.length > 15) return null;
  if (digits.startsWith('30') && !digits.startsWith('3069')) return null;
  return digits;
}
