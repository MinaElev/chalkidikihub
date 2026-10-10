import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every API route must start from an explicit guard. v3's /api/admin/* routes
 * relied on the URL segment and were open to anyone (the proxy skips /api).
 * A route passes if it calls a guard from lib/auth/guards.ts, the shared
 * rate limiter, or documents why it is public with a "Guard:" comment.
 */
function routes(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return routes(p);
    return name === 'route.ts' || name === 'route.tsx' ? [p] : [];
  });
}

const GUARD = /require(SuperAdmin|User|ListingOwner|Cron|SuperAdminOrCron|InternalOrSuperAdmin|CronOrSuperAdmin|OwnerOrInternal)\(|allowRequest\(|\/\/ Guard:/;

describe('API guards', () => {
  const files = routes(join(process.cwd(), 'src', 'app', 'api'));
  it('found the routes', () => expect(files.length).toBeGreaterThan(5));
  for (const f of files) {
    it(f.replace(process.cwd(), ''), () => {
      expect(GUARD.test(readFileSync(f, 'utf8'))).toBe(true);
    });
  }
});
