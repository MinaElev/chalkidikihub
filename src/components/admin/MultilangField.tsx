'use client';

import { useState } from 'react';
import { Loader2, Wand2, Check, Globe } from 'lucide-react';

export type LocaleCode = 'el' | 'en' | 'de' | 'bg' | 'ru' | 'ro' | 'sr';
export const LOCALES: LocaleCode[] = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'];
export const LOCALE_NAMES: Record<LocaleCode, string> = {
  el: 'Ελληνικά', en: 'English', de: 'Deutsch',
  bg: 'Български', ru: 'Русский', ro: 'Română', sr: 'Srpski',
};
export const LOCALE_FLAGS: Record<LocaleCode, string> = {
  el: '🇬🇷', en: '🇬🇧', de: '🇩🇪', bg: '🇧🇬', ru: '🇷🇺', ro: '🇷🇴', sr: '🇷🇸',
};

interface Props {
  label: string;
  values: Record<LocaleCode, string>;
  onChange: (lang: LocaleCode, value: string) => void;
  type?: 'input' | 'textarea';
  rows?: number;
  maxLength?: number;
  /** If provided, adds a "Fill missing with AI" button that translates from sourceLocale */
  onFillMissing?: (sourceLocale: LocaleCode) => Promise<void>;
  filling?: boolean;
  description?: string;
}

export function MultilangField({
  label, values, onChange, type = 'input', rows = 3, maxLength, onFillMissing, filling, description,
}: Props) {
  const [activeTab, setActiveTab] = useState<LocaleCode>('el');

  const coverage = LOCALES.filter(l => (values[l] || '').trim()).length;
  const hasSource = (values.el || '').trim() || (values.en || '').trim();

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
        <Globe className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-sm font-medium text-gray-800">{label}</span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
          coverage === 7 ? 'bg-green-100 text-green-700' : coverage === 0 ? 'bg-gray-200 text-gray-500' : 'bg-amber-100 text-amber-700'
        }`}>
          {coverage}/7
        </span>
        {onFillMissing && (
          <button
            type="button"
            onClick={() => onFillMissing(activeTab)}
            disabled={filling || !hasSource || coverage === 7}
            className="ml-auto text-xs flex items-center gap-1 px-2 py-1 bg-white hover:bg-primary-50 border border-primary-200 text-primary-700 font-medium rounded disabled:opacity-40"
            title={`Συμπλήρωσε ελλείπουσες γλώσσες με AI από ${LOCALE_NAMES[activeTab]}`}
          >
            {filling ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
            Fill missing
          </button>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-gray-500 px-3 pt-2">{description}</p>
      )}

      {/* Language tabs */}
      <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-gray-100">
        {LOCALES.map(l => {
          const hasContent = (values[l] || '').trim().length > 0;
          const active = l === activeTab;
          return (
            <button
              key={l}
              type="button"
              onClick={() => setActiveTab(l)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                active
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="leading-none">{LOCALE_FLAGS[l]}</span>
              <span className="uppercase text-[10px]">{l}</span>
              {hasContent && <Check className={`w-3 h-3 ${active ? 'text-white' : 'text-green-600'}`} />}
            </button>
          );
        })}
      </div>

      {/* Active language editor */}
      <div className="p-3">
        {type === 'textarea' ? (
          <textarea
            rows={rows}
            value={values[activeTab] || ''}
            onChange={(e) => onChange(activeTab, e.target.value)}
            maxLength={maxLength}
            placeholder={`${LOCALE_NAMES[activeTab]} — ${label}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        ) : (
          <input
            type="text"
            value={values[activeTab] || ''}
            onChange={(e) => onChange(activeTab, e.target.value)}
            maxLength={maxLength}
            placeholder={`${LOCALE_NAMES[activeTab]} — ${label}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        )}
        {maxLength && (
          <div className="text-right text-[10px] text-gray-400 mt-1 tabular-nums">
            {(values[activeTab] || '').length} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
