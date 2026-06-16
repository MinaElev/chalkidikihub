/**
 * Single source of truth for reversible feature gates.
 *
 * Each flag here represents something we want to be able to toggle without
 * touching code or losing data. The pattern is: render-time check on a
 * NEXT_PUBLIC_* env var, with the off state being the cautious/quiet default
 * so a missing var never re-enables a hidden feature by accident.
 *
 * To re-enable a flag, set its env var to "1" (in .env.local for dev, or in
 * the Vercel project settings for prod) and redeploy. NEXT_PUBLIC_* values
 * are inlined at build time — runtime changes require a new build.
 */

/**
 * AdSense script (adsbygoogle.js). Off while the site is under review or
 * rejected, so the script isn't shipped to every visitor for no benefit.
 * Flip on once approved, or briefly when re-submitting so the AdSense
 * crawler finds the script during review. See DeferredScripts.tsx.
 */
export const ADSENSE_ENABLED =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === '1';

/**
 * External booking links on listing pages (Booking.com, Airbnb, owner
 * website). Off while we minimise the "affiliate aggregator" signal for
 * the AdSense review and Google quality classifiers — the data stays in
 * the DB and on the dashboard, just isn't rendered to the public.
 * Flip on after AdSense approval (and add rel="nofollow sponsored" then).
 *
 * Gates both the UI buttons on the listing detail page and the auto-
 * generated FAQ entry that mentions Booking.com / Airbnb by name.
 */
export const EXTERNAL_BOOKING_LINKS_ENABLED =
  process.env.NEXT_PUBLIC_EXTERNAL_BOOKING_LINKS_ENABLED === '1';
