import { createClient } from './supabase/client';

export async function getUserRole(): Promise<'owner' | 'admin' | 'superadmin' | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return (data?.role as 'owner' | 'admin' | 'superadmin') || 'owner';
}

export function isSuperAdmin(role: string | null): boolean {
  return role === 'superadmin';
}
