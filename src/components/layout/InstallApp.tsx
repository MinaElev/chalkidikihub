'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

// Chrome fires beforeinstallprompt once, often before the menu exists: keep it.
let deferred: InstallPrompt | null = null;
const listeners = new Set<() => void>();
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as InstallPrompt;
    listeners.forEach((l) => l());
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    listeners.forEach((l) => l());
  });
}

/**
 * "Install the app" in the mobile menu, shown only where the browser offers
 * installation (Chrome/Edge/Samsung on Android, desktop Chrome). Safari users
 * add it with Share → Add to Home Screen, which needs no button.
 */
export function InstallApp({ label }: { label: string }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const sync = () => setAvailable(Boolean(deferred));
    sync();
    listeners.add(sync);
    return () => { listeners.delete(sync); };
  }, []);

  if (!available) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => null);
    deferred = null;
    setAvailable(false);
  }

  return (
    <button type="button" onClick={install} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-semibold text-white">
      <Download className="size-5" aria-hidden />
      {label}
    </button>
  );
}
