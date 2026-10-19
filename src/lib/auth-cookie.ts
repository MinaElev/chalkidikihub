// Client-side cookie check that doesn't pull in @supabase/ssr. Used by
// Header components to decide whether to load the full Supabase SDK at all.
// Anonymous visitors (no sb-* cookie) never download the 53KB auth client.
export function hasSupabaseAuthCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim().startsWith('sb-'));
}
