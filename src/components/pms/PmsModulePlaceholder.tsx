'use client';

import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { ArrowLeft, Zap, Construction } from 'lucide-react';

export interface PmsRoadmapItem {
  title: string;
  desc: string;
  eta?: string;
  done?: boolean;
}

interface Props {
  icon: React.ElementType;
  accent: string;            // tailwind color token: 'violet' | 'sky' | ...
  title: { el: string; en: string };
  lede: { el: string; en: string };
  competitorPitch: { el: string; en: string };
  roadmap: {
    el: PmsRoadmapItem[];
    en: PmsRoadmapItem[];
  };
}

/**
 * Shared placeholder used while each PMS module is being built out.
 * Shows: module hero, competitor positioning, roadmap with phases,
 * "back to command center" breadcrumb.
 */
export function PmsModulePlaceholder({ icon: Icon, accent, title, lede, competitorPitch, roadmap }: Props) {
  const locale = useLocale();
  const t = title[locale as 'el' | 'en'] || title.en;
  const l = lede[locale as 'el' | 'en'] || lede.en;
  const pitch = competitorPitch[locale as 'el' | 'en'] || competitorPitch.en;
  const items = roadmap[locale as 'el' | 'en'] || roadmap.en;

  const accentClass: Record<string, { grad: string; ring: string; text: string; soft: string }> = {
    violet:  { grad: 'from-violet-600 via-fuchsia-600 to-indigo-700', ring: 'ring-violet-500/30',  text: 'text-violet-700',  soft: 'bg-violet-50 border-violet-200' },
    sky:     { grad: 'from-sky-600 via-cyan-600 to-blue-700',         ring: 'ring-sky-500/30',     text: 'text-sky-700',     soft: 'bg-sky-50 border-sky-200' },
    emerald: { grad: 'from-emerald-600 via-teal-600 to-green-700',    ring: 'ring-emerald-500/30', text: 'text-emerald-700', soft: 'bg-emerald-50 border-emerald-200' },
    amber:   { grad: 'from-amber-600 via-orange-600 to-red-600',      ring: 'ring-amber-500/30',   text: 'text-amber-700',   soft: 'bg-amber-50 border-amber-200' },
    fuchsia: { grad: 'from-fuchsia-600 via-pink-600 to-rose-600',     ring: 'ring-fuchsia-500/30', text: 'text-fuchsia-700', soft: 'bg-fuchsia-50 border-fuchsia-200' },
    rose:    { grad: 'from-rose-600 via-pink-600 to-red-600',         ring: 'ring-rose-500/30',    text: 'text-rose-700',    soft: 'bg-rose-50 border-rose-200' },
    teal:    { grad: 'from-teal-600 via-emerald-600 to-cyan-700',     ring: 'ring-teal-500/30',    text: 'text-teal-700',    soft: 'bg-teal-50 border-teal-200' },
    slate:   { grad: 'from-slate-700 via-slate-800 to-slate-900',     ring: 'ring-slate-500/30',   text: 'text-slate-700',   soft: 'bg-slate-50 border-slate-200' },
  };
  const c = accentClass[accent] || accentClass.violet;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-violet-700">
        <ArrowLeft className="w-4 h-4" /> Command Center
      </Link>

      {/* HERO */}
      <header className={`relative overflow-hidden rounded-3xl p-8 md:p-10 text-white bg-gradient-to-br ${c.grad} ring-1 ${c.ring}`}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start gap-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shrink-0">
            <Icon className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-3">
              <Zap className="w-3 h-3" fill="currentColor" /> PMS · {locale === 'el' ? 'Υπό κατασκευή' : 'In development'}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t}</h1>
            <p className="text-white/85 text-sm md:text-base leading-relaxed max-w-2xl">{l}</p>
          </div>
        </div>
      </header>

      {/* COMPETITOR PITCH */}
      <section className={`border-2 ${c.soft} rounded-2xl p-5`}>
        <p className={`text-[11px] font-bold uppercase tracking-[0.1em] ${c.text} mb-1.5`}>
          {locale === 'el' ? 'Γιατί αξίζει' : 'Why it matters'}
        </p>
        <p className="text-sm text-slate-800 leading-relaxed font-medium">{pitch}</p>
      </section>

      {/* ROADMAP */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Construction className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">
            {locale === 'el' ? 'Τι έρχεται σε αυτό το module' : 'Roadmap for this module'}
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl border ${
                it.done ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold tabular-nums ${
                it.done ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
              }`}>
                {it.done ? '✓' : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{it.title}</h3>
                  {it.eta && (
                    <span className="text-[10px] font-mono text-slate-500 tabular-nums shrink-0">{it.eta}</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
