'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Shield, User, Loader2, Trash2, KeyRound, MailCheck, MailWarning } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  email_verified_at: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  const [deleting, setDeleting] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);

  async function sendPasswordReset(userId: string, email: string, fullName: string) {
    if (!email) {
      alert('Ο χρήστης δεν έχει email καταχωρημένο.');
      return;
    }
    if (!confirm(`Αποστολή email επαναφοράς κωδικού στον/στην ${fullName || email};`)) return;
    setResetting(userId);
    try {
      const res = await fetch('/api/admin/send-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Το email επαναφοράς στάλθηκε στο ${email}.`);
      } else {
        alert(`Σφάλμα: ${data.error}`);
      }
    } catch (err) {
      alert(`Σφάλμα: ${(err as Error).message}`);
    }
    setResetting(null);
  }

  async function changeRole(userId: string, newRole: string) {
    const supabase = createClient();
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    loadUsers();
  }

  async function deleteUser(userId: string, userName: string) {
    if (!confirm(`Διαγραφή χρήστη "${userName}";\n\nΘα διαγραφούν και όλα τα listings, submissions και favorites του. Αυτή η ενέργεια δεν αναιρείται.`)) return;
    setDeleting(userId);
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
    setDeleting(null);
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Users ({users.length})</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">User</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Phone</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Role</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Joined</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 min-w-[160px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.role === 'superadmin' ? 'bg-red-100' : 'bg-primary-100'
                    }`}>
                      {user.role === 'superadmin' ? <Shield className="w-4 h-4 text-red-600" /> : <User className="w-4 h-4 text-primary-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.full_name || 'No name'}</div>
                      <div className="text-xs text-gray-500">{user.email || user.id.slice(0, 8) + '...'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.phone || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'superadmin' ? 'bg-red-100 text-red-700' :
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.email_verified_at ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"
                      title={`Επιβεβαιώθηκε: ${new Date(user.email_verified_at).toLocaleString('el-GR')}`}
                    >
                      <MailCheck className="w-3 h-3" /> Επιβεβαιωμένο
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      <MailWarning className="w-3 h-3" /> Εκκρεμεί
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {user.email !== 'mnc@hotmail.gr' && (
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                      >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                      <button
                        onClick={() => sendPasswordReset(user.id, user.email, user.full_name)}
                        disabled={resetting === user.id || !user.email}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Αποστολή email επαναφοράς κωδικού"
                      >
                        {resetting === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id, user.full_name || user.email)}
                        disabled={deleting === user.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Διαγραφή χρήστη"
                      >
                        {deleting === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
