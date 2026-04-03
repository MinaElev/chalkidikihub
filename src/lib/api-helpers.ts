import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createApiClient() {
  return createClient(supabaseUrl, supabaseKey);
}

// Transform multilingual DB row to Record<string, string>
export function toLocaleMap(row: Record<string, unknown>, prefix: string): Record<string, string> {
  return {
    el: (row[`${prefix}_el`] as string) || '',
    en: (row[`${prefix}_en`] as string) || '',
    de: (row[`${prefix}_de`] as string) || '',
    bg: (row[`${prefix}_bg`] as string) || '',
    ru: (row[`${prefix}_ru`] as string) || '',
    ro: (row[`${prefix}_ro`] as string) || '',
  };
}
