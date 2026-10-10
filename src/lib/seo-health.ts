// Live HTML SEO health check — fetches a representative sample of rendered
// pages and reports back the signals Googlebot would actually see (status,
// canonical, robots, hreflang, title/desc lengths, H1, JSON-LD count).
//
// Different scope from /admin/seo (which inspects DB columns) and
// /admin/quality (which scores content completeness) — this one verifies
// what the SSR'd page actually emits.

export type PageCheck = {
  url: string;
  bucket: string;
  status: number | 'error';
  redirectedTo?: string;
  ms: number;
  title: string;
  titleLen: number;
  description: string;
  descriptionLen: number;
  h1: string;
  robots: string;
  canonical: string;
  hreflangCount: number;
  jsonLdCount: number;
  imagesWithoutAlt: number;
  issues: string[];
};

const SAMPLE_TIMEOUT_MS = 12000;

export type Severity = 'critical' | 'warning' | 'info';
export type Issue = { severity: Severity; code: string; message: string };

function classify(check: Omit<PageCheck, 'issues'>): string[] {
  const issues: Issue[] = [];

  if (check.status === 'error') {
    issues.push({ severity: 'critical', code: 'fetch_error', message: 'Could not fetch page' });
  } else if (check.status >= 500) {
    issues.push({ severity: 'critical', code: 'server_error', message: `Server error (${check.status})` });
  } else if (check.status === 404) {
    issues.push({ severity: 'critical', code: 'not_found', message: '404 — page missing' });
  } else if (check.status >= 400) {
    issues.push({ severity: 'critical', code: 'http_error', message: `HTTP ${check.status}` });
  } else if (check.status >= 300 && check.status < 400) {
    issues.push({ severity: 'info', code: 'redirected', message: `Redirected to ${check.redirectedTo || '?'}` });
  }

  if (check.status === 200 || (typeof check.status === 'number' && check.status < 300)) {
    if (!check.title) {
      issues.push({ severity: 'critical', code: 'no_title', message: 'Missing <title>' });
    } else if (check.titleLen < 25) {
      issues.push({ severity: 'warning', code: 'short_title', message: `Title only ${check.titleLen} chars` });
    } else if (check.titleLen > 70) {
      issues.push({ severity: 'warning', code: 'long_title', message: `Title ${check.titleLen} chars (>70 truncated by Google)` });
    }

    if (!check.description) {
      issues.push({ severity: 'warning', code: 'no_description', message: 'Missing meta description' });
    } else if (check.descriptionLen < 60) {
      issues.push({ severity: 'warning', code: 'short_description', message: `Description only ${check.descriptionLen} chars` });
    } else if (check.descriptionLen > 175) {
      issues.push({ severity: 'info', code: 'long_description', message: `Description ${check.descriptionLen} chars (>175 truncated)` });
    }

    if (!check.canonical) {
      issues.push({ severity: 'warning', code: 'no_canonical', message: 'No canonical URL set' });
    }

    if (!check.h1) {
      issues.push({ severity: 'warning', code: 'no_h1', message: 'No <h1> on page' });
    }

    if (/noindex/i.test(check.robots)) {
      issues.push({ severity: 'info', code: 'noindex', message: 'Page is noindex (intentional?)' });
    }

    if (check.jsonLdCount === 0) {
      issues.push({ severity: 'info', code: 'no_jsonld', message: 'No structured data (JSON-LD)' });
    }

    if (check.hreflangCount === 0) {
      issues.push({ severity: 'info', code: 'no_hreflang', message: 'No hreflang alternates' });
    } else if (check.hreflangCount < 7) {
      issues.push({ severity: 'info', code: 'partial_hreflang', message: `Only ${check.hreflangCount} hreflang tags (expected 8 incl. x-default)` });
    }

    if (check.imagesWithoutAlt > 5) {
      issues.push({ severity: 'warning', code: 'missing_alts', message: `${check.imagesWithoutAlt} images without alt` });
    }

    if (check.ms > 3000) {
      issues.push({ severity: 'warning', code: 'slow', message: `Slow response (${check.ms}ms)` });
    }
  }

  return issues.map((i) => `${i.severity}:${i.code}:${i.message}`);
}

function pickAttr(html: string, tagRegex: RegExp, attrName: string): string {
  const match = html.match(tagRegex);
  if (!match) return '';
  const attrMatch = match[0].match(new RegExp(`${attrName}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return attrMatch ? attrMatch[1] : '';
}

function parseHtml(html: string) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const descMatch = html.match(/<meta\s+[^>]*name\s*=\s*["']description["'][^>]*>/i);
  const description = descMatch ? (descMatch[0].match(/content\s*=\s*["']([^"']*)["']/i)?.[1] || '') : '';

  const robotsMatch = html.match(/<meta\s+[^>]*name\s*=\s*["']robots["'][^>]*>/i);
  const robots = robotsMatch ? (robotsMatch[0].match(/content\s*=\s*["']([^"']*)["']/i)?.[1] || '') : '';

  const canonical = pickAttr(html, /<link[^>]*rel\s*=\s*["']canonical["'][^>]*>/i, 'href');

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  const hreflangs = html.match(/<link[^>]*rel\s*=\s*["']alternate["'][^>]*hreflang/gi) || [];
  const jsonLds = html.match(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>/gi) || [];

  // Count <img> tags without alt= attribute
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const withoutAlt = imgs.filter((img) => !/\salt\s*=/i.test(img)).length;

  return {
    title,
    description,
    robots,
    canonical,
    h1,
    hreflangCount: hreflangs.length,
    jsonLdCount: jsonLds.length,
    imagesWithoutAlt: withoutAlt,
  };
}

export async function checkPage(url: string, bucket: string): Promise<PageCheck> {
  const t0 = Date.now();
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), SAMPLE_TIMEOUT_MS);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ChalkidikiHub-SEO-Bot/1.0' },
      redirect: 'follow',
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const ms = Date.now() - t0;

    const finalUrl = res.url;
    const redirected = finalUrl !== url ? finalUrl : undefined;

    const text = await res.text();
    const parsed = parseHtml(text);

    const partial: Omit<PageCheck, 'issues'> = {
      url,
      bucket,
      status: res.status,
      redirectedTo: redirected,
      ms,
      title: parsed.title,
      titleLen: parsed.title.length,
      description: parsed.description,
      descriptionLen: parsed.description.length,
      h1: parsed.h1,
      robots: parsed.robots,
      canonical: parsed.canonical,
      hreflangCount: parsed.hreflangCount,
      jsonLdCount: parsed.jsonLdCount,
      imagesWithoutAlt: parsed.imagesWithoutAlt,
    };
    return { ...partial, issues: classify(partial) };
  } catch {
    const ms = Date.now() - t0;
    const partial: Omit<PageCheck, 'issues'> = {
      url,
      bucket,
      status: 'error',
      ms,
      title: '',
      titleLen: 0,
      description: '',
      descriptionLen: 0,
      h1: '',
      robots: '',
      canonical: '',
      hreflangCount: 0,
      jsonLdCount: 0,
      imagesWithoutAlt: 0,
    };
    return { ...partial, issues: classify(partial) };
  }
}

export async function crawlBatch(urls: Array<{ url: string; bucket: string }>, concurrency = 10): Promise<PageCheck[]> {
  const results: PageCheck[] = [];
  let i = 0;
  async function worker() {
    while (i < urls.length) {
      const idx = i++;
      const { url, bucket } = urls[idx];
      const r = await checkPage(url, bucket);
      results.push(r);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}
