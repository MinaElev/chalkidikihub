/**
 * Client-side helper to trigger on-demand revalidation after admin saves.
 * Call after successful Supabase update in admin edit pages.
 *
 * Usage: await revalidateContent('beaches', 'sani');
 */
export async function revalidateContent(type: string, slug?: string): Promise<void> {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, slug }),
    });
  } catch {
    // Silent fail — revalidation is best-effort
  }
}
