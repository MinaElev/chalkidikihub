import 'server-only';
import { publicDb } from '@/lib/supabase/clients';
import { allLocales } from '@/lib/i18n/localize';

/** v3 compatibility for ported pages. */
export const createApiClient = publicDb;
export const toLocaleMap = (row: Record<string, unknown>, prefix: string) => allLocales(row, prefix);
export { adminDb as createAdminClient } from '@/lib/supabase/clients';
