// Classification of GSC coverageState strings → actionable category, severity,
// Greek label and advice. coverageState comes back in STABLE English (we force
// languageCode=en-US in inspectUrl), so substring matching here is safe.
//
// Categories drive the dashboard grouping:
//   indexed      – on Google, all good
//   indexed_warn – on Google but with a problem (e.g. blocked by robots)
//   intentional  – excluded on purpose (canonical alternates, our own noindex)
//   content      – Google chose not to index (thin/duplicate) → content work
//   crawl        – discovered but not yet crawled → crawl budget / linking
//   redirect     – URL redirects → shouldn't be a canonical/sitemap entry
//   notfound     – 404 → fix link or 301
//   error        – 5xx / soft-404 → server/template bug
//   canonical    – duplicate / canonical conflict
//   blocked      – blocked by robots.txt (usually a config bug)
//   unknown      – Google doesn't know the URL yet
//   uninspected  – we haven't inspected it yet (seed state)

export type CoverageCategory =
  | 'indexed' | 'indexed_warn' | 'intentional' | 'content' | 'crawl'
  | 'redirect' | 'notfound' | 'error' | 'canonical' | 'blocked'
  | 'unknown' | 'uninspected';

export type CoverageSeverity = 'ok' | 'info' | 'warn' | 'critical';

export type StateInfo = {
  category: CoverageCategory;
  severity: CoverageSeverity;
  labelEl: string;
  adviceEl: string;
};

const UNINSPECTED = '(not yet inspected)';

export function classifyState(state: string | null | undefined): StateInfo {
  const s = (state || '').toLowerCase();

  if (!state || s === UNINSPECTED) {
    return { category: 'uninspected', severity: 'info', labelEl: 'Δεν ελέγχθηκε ακόμα', adviceEl: 'Θα ελεγχθεί σε επόμενο batch.' };
  }

  // Indexed variants
  if (s.includes('indexed') && s.includes('blocked by robots')) {
    return { category: 'indexed_warn', severity: 'warn', labelEl: 'Ευρετηριασμένη αλλά μπλοκαρισμένη από robots.txt', adviceEl: 'Το robots εμποδίζει το Google να δει το περιεχόμενο/noindex. Ξεμπλόκαρε το path (αν την θες indexed) ή βάλε noindex χωρίς robots-block (αν όχι).' };
  }
  if (s.includes('submitted and indexed')) {
    return { category: 'indexed', severity: 'ok', labelEl: 'Υποβλήθηκε & ευρετηριάστηκε', adviceEl: 'Όλα καλά.' };
  }
  if (s.includes('indexed') && s.includes('not submitted')) {
    return { category: 'indexed', severity: 'ok', labelEl: 'Ευρετηριασμένη (εκτός sitemap)', adviceEl: 'Indexed· καλό να μπει και στο sitemap.' };
  }

  // Not-indexed reasons
  if (s.includes('blocked by robots')) {
    return { category: 'blocked', severity: 'critical', labelEl: 'Αποκλεισμός από robots.txt', adviceEl: 'Αν πρέπει να είναι indexed, ξεμπλόκαρε το path στο robots.ts. Αν όχι, αφαίρεσέ την από sitemap/hreflang.' };
  }
  if (s.includes('crawled') && s.includes('not indexed')) {
    return { category: 'content', severity: 'warn', labelEl: 'Ανιχνεύθηκε – δεν ευρετηριάστηκε', adviceEl: 'Το Google το είδε αλλά το θεώρησε thin/duplicate. Χρειάζεται μοναδικό, ουσιαστικό περιεχόμενο + εσωτερικά links.' };
  }
  if (s.includes('discovered') && s.includes('not indexed')) {
    return { category: 'crawl', severity: 'warn', labelEl: 'Εντοπίστηκε – δεν ευρετηριάστηκε', adviceEl: 'Γνωστό αλλά μη ανιχνευμένο (crawl budget). Μείωσε το sitemap bloat + δυνάμωσε το internal linking.' };
  }
  if (s.includes('noindex')) {
    return { category: 'intentional', severity: 'info', labelEl: 'Εξαίρεση με ετικέτα noindex', adviceEl: 'Επιβεβαίωσε ότι το noindex είναι σκόπιμο για αυτό το template.' };
  }
  if (s.includes('page with redirect')) {
    return { category: 'redirect', severity: 'warn', labelEl: 'Σελίδα με ανακατεύθυνση', adviceEl: 'Redirect URL δεν πρέπει να είναι canonical ούτε σε sitemap/hreflang. Βρες τι κάνει redirect.' };
  }
  if (s.includes('soft 404')) {
    return { category: 'error', severity: 'warn', labelEl: 'Ήπιο 404 (soft 404)', adviceEl: 'Επιστρέφει 200 αλλά μοιάζει άδεια. Επίστρεψε πραγματικό 404 ή πρόσθεσε περιεχόμενο.' };
  }
  if (s.includes('not found') || s.includes('404')) {
    return { category: 'notfound', severity: 'warn', labelEl: 'Δεν βρέθηκε (404)', adviceEl: '301 σε σχετική σελίδα ή αφαίρεση όλων των links προς αυτή.' };
  }
  if (s.includes('server error') || s.includes('5xx')) {
    return { category: 'error', severity: 'critical', labelEl: 'Σφάλμα διακομιστή (5xx)', adviceEl: 'Bug στο template/route — φτιάξ’ το άμεσα.' };
  }
  if (s.includes('alternate page') && s.includes('canonical')) {
    return { category: 'intentional', severity: 'ok', labelEl: 'Εναλλακτική με σωστό canonical', adviceEl: 'Σκόπιμο (hreflang/canonical consolidation).' };
  }
  if (s.includes('duplicate') && s.includes('google chose')) {
    return { category: 'canonical', severity: 'info', labelEl: 'Διπλότυπο: Google επέλεξε άλλο canonical', adviceEl: 'Το Google αγνόησε το canonical σου. Δες αν το περιεχόμενο διαφοροποιείται.' };
  }
  if (s.includes('duplicate')) {
    return { category: 'canonical', severity: 'info', labelEl: 'Διπλότυπο χωρίς canonical', adviceEl: 'Όρισε ρητό canonical.' };
  }
  if (s.includes('unknown')) {
    return { category: 'unknown', severity: 'info', labelEl: 'Άγνωστη στο Google', adviceEl: 'Δεν την έχει ανακαλύψει ακόμα.' };
  }

  return { category: 'content', severity: 'info', labelEl: state, adviceEl: '' };
}

// Which categories are genuine problems we should drive to zero.
export const PROBLEM_CATEGORIES: CoverageCategory[] = [
  'blocked', 'indexed_warn', 'redirect', 'notfound', 'error', 'content', 'crawl', 'canonical',
];
