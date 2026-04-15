'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const messages: Record<string, { title: string; body: string; retry: string; home: string }> = {
  el: { title: 'Ωχ!', body: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.', retry: 'Δοκιμή ξανά', home: 'Αρχική' },
  en: { title: 'Oops!', body: 'Something went wrong. Please try again.', retry: 'Try again', home: 'Home' },
  de: { title: 'Hoppla!', body: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.', retry: 'Erneut versuchen', home: 'Startseite' },
  bg: { title: 'Опа!', body: 'Нещо се обърка. Моля, опитайте отново.', retry: 'Опитай отново', home: 'Начало' },
  ru: { title: 'Ой!', body: 'Что-то пошло не так. Попробуйте ещё раз.', retry: 'Попробовать снова', home: 'Главная' },
  ro: { title: 'Oops!', body: 'Ceva a mers prost. Vă rugăm încercați din nou.', retry: 'Încercați din nou', home: 'Acasă' },
  sr: { title: 'Ups!', body: 'Nešto je pošlo naopako. Pokušajte ponovo.', retry: 'Pokušaj ponovo', home: 'Početna' },
};

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const t = messages[locale] || messages.en;

  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600 mb-8">{t.body}</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t.retry}
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            {t.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
