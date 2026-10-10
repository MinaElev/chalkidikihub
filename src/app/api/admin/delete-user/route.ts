import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin();
    if (auth instanceof NextResponse) return auth;

    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const adminClient = createAdminClient();

    // Delete user data first (cascading won't handle all tables)
    const dbClient = createApiClient();
    await dbClient.from('user_submissions').delete().eq('user_id', userId);
    await dbClient.from('favorites').delete().eq('user_id', userId);
    await dbClient.from('activity_logs').delete().contains('details', { user_id: userId });

    // Delete listings + their images
    const { data: listings } = await dbClient.from('listings').select('id').eq('owner_id', userId);
    if (listings) {
      for (const listing of listings) {
        await dbClient.from('listing_images').delete().eq('listing_id', listing.id);
      }
      await dbClient.from('listings').delete().eq('owner_id', userId);
    }

    // Delete profile
    await dbClient.from('profiles').delete().eq('id', userId);

    // Delete auth user
    const { error } = await adminClient.auth.admin.deleteUser(userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Log the action
    await dbClient.from('activity_logs').insert({
      type: 'admin_action',
      severity: 'warning',
      message: `User deleted: ${userId}`,
      details: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
