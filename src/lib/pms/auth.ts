import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Resolve the effective owner_id for a PMS write.
 *
 * - Regular owner → owner_id = their own auth.uid()
 * - Super-admin (profiles.role='admin') → owner_id = the listing's actual owner
 *
 * This means admins can create feeds / bookings / blocks on behalf of any
 * owner (for support or testing) but the row is still attributed to the
 * real owner — the owner sees the action in their dashboard and RLS keeps
 * behaving correctly even after the admin leaves.
 *
 * Returns null when the user isn't signed in, the listing doesn't exist,
 * or a non-admin user tries to touch a listing they don't own.
 */
export async function resolveEffectiveOwner(
  supabase: SupabaseClient,
  listingId: string
): Promise<{ ownerId: string; isAdmin: boolean } | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: listing }, { data: profile }] = await Promise.all([
    supabase.from('listings').select('owner_id').eq('id', listingId).single(),
    supabase.from('profiles').select('role').eq('id', user.id).single(),
  ]);

  if (!listing) return null;
  const isAdmin = profile?.role === 'admin';
  if (!isAdmin && listing.owner_id !== user.id) return null;
  return { ownerId: listing.owner_id, isAdmin };
}

export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return profile?.role === 'admin';
}
