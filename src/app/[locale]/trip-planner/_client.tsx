'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Sparkles, Loader2, Waves, UtensilsCrossed, Landmark, Sun, Sunset, Moon, MapPin, RotateCcw, Wand2 } from 'lucide-react';

interface Place { type: string; slug: string; name: string; location: string; href: string }
interface Day { day: number; title: string; morning: string; afternoon: string; evening: string; places: Place[] }
interface Result { intro: string; days: Day[] }

const AREAS = [
  { value: '', el: 'Όλη η Χαλκιδική', en: 'All of Halkidiki' },
  { value: 'kassandra', el: 'Κασσάνδρα', en: 'Kassandra' },
  { value: 'sithonia', el: 'Σιθωνία', en: 'Sithonia' },
  { value: 'athos', el: 'Άθως', en: 'Athos' },
  { value: 'mainland', el: 'Ενδοχώρα', en: 'Mainland' },
];
const PARTIES = [
  { value: 'family', el: '👨‍👩‍👧 Οικογένεια', en: '👨‍👩‍👧 Family' },
  { value: 'couple', el: '💑 Ζευγάρι', en: '💑 Couple' },
  { value: 'friends', el: '🎉 Παρέα', en: '🎉 Friends' },
  { value: 'solo', el: '🧍 Μόνος/η', en: '🧍 Solo' },
];
const INTERESTS = [
  { value: 'παραλίες', el: '🏖️ Παραλίες', en: '🏖️ Beaches' },
  { value: 'φαγητό', el: '🍽️ Φαγητό', en: '🍽️ Food' },
  { value: 'νυχτερινή ζωή', el: '🍸 Νυχτερινή ζωή', en: '🍸 Nightlife' },
  { value: 'πολιτισμός', el: '🏛️ Πολιτισμός', en: '🏛️ Culture' },
  { value: 'φύση', el: '🌲 Φύση', en: '🌲 Nature' },
  { value: 'χαλάρωση', el: '🧘 Χαλάρωση', en: '🧘 Relax' },
];
const TYPE_ICON: Record<string, typeof Waves> = { beach: Waves, restaurant: UtensilsCrossed, activity: Landmark };

export default function TripPlannerClient() {
  const locale = useLocale();
  const el = locale === 'el';
  const [days, setDays] = useState(3);
  const [area, setArea] = useState('');
  const [party, setParty] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  function toggleInterest(v: string) {
    setInterests((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  }

  async function generate() {
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/ai/trip-planner', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, area, party, interests, locale }),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error || (el ? 'Κάτι πήγε στραβά. Δοκίμασε ξανά.' : 'Something went wrong.'));
      else setResult(json);
    } catch {
      setError(el ? 'Σφάλμα δικτύου.' : 'Network error.');
    }
    setLoading(false);
  }

  const blocks = (d: Day) => [
    { icon: Sun, label: el ? 'Πρωί' : 'Morning', text: d.morning },
    { icon: Sunset, label: el ? 'Απόγευμα' : 'Afternoon', text: d.afternoon },
    { icon: Moon, label: el ? 'Βράδυ' : 'Evening', text: d.evening },
  ].filter((b) => b.text);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> AI · {el ? 'Δωρεάν' : 'Free'}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {el ? 'Σχεδίασε το ταξίδι σου στη Χαλκιδική' : 'Plan your Halkidiki trip'}
        </h1>
        <p className="mt-2 text-gray-600">
          {el
            ? 'Πες μας τι σου αρέσει και το AI φτιάχνει πρόγραμμα ημέρα-ημέρα, μόνο με πραγματικά μέρη της Χαλκιδικής.'
            : 'Tell us what you like and the AI builds a day-by-day plan using only real Halkidiki places.'}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{el ? 'Ημέρες' : 'Days'}</label>
            <div className="flex gap-1.5">
              {[2, 3, 4, 5, 7].map((n) => (
                <button key={n} type="button" onClick={() => setDays(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    days === n ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{el ? 'Περιοχή' : 'Area'}</label>
            <select value={area} onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none">
              {AREAS.map((a) => <option key={a.value} value={a.value}>{el ? a.el : a.en}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{el ? 'Ποιοι ταξιδεύετε;' : 'Who\'s travelling?'}</label>
          <div className="flex flex-wrap gap-2">
            {PARTIES.map((p) => (
              <button key={p.value} type="button" onClick={() => setParty(party === p.value ? '' : p.value)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  party === p.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>{el ? p.el : p.en}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{el ? 'Τι σας αρέσει;' : 'What do you like?'}</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((it) => (
              <button key={it.value} type="button" onClick={() => toggleInterest(it.value)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  interests.includes(it.value) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>{el ? it.el : it.en}</button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold shadow-sm disabled:opacity-60 transition-all">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
          {loading ? (el ? 'Δημιουργία προγράμματος…' : 'Building your plan…') : (el ? 'Φτιάξε το πρόγραμμά μου' : 'Build my plan')}
        </button>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="mt-8">
          {result.intro && (
            <div className="mb-6 rounded-2xl bg-primary-50/70 border border-primary-100 p-4 text-primary-900 text-sm leading-relaxed">
              {result.intro}
            </div>
          )}
          <div className="space-y-5">
            {result.days.map((d) => (
              <div key={d.day} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-sm shrink-0">{d.day}</span>
                  <h3 className="text-lg font-bold text-gray-900">{d.title}</h3>
                </div>
                <div className="space-y-3">
                  {blocks(d).map((b) => (
                    <div key={b.label} className="flex gap-3">
                      <div className="flex flex-col items-center shrink-0">
                        <b.icon className="w-4 h-4 text-primary-500 mt-0.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{b.label}</div>
                        <p className="text-sm text-gray-700 leading-relaxed">{b.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {d.places.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                    {d.places.map((p) => {
                      const Icon = TYPE_ICON[p.type] || MapPin;
                      return (
                        <Link key={p.href} href={p.href}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 hover:bg-primary-50 hover:text-primary-700 border border-gray-200 text-xs font-medium text-gray-700 transition-colors">
                          <Icon className="w-3.5 h-3.5" />{p.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
              <RotateCcw className="w-4 h-4" /> {el ? 'Νέο πρόγραμμα' : 'New plan'}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            {el ? 'Δημιουργήθηκε από AI με βάση πραγματικά μέρη του ChalkidikiHub. Έλεγξε ώρες & διαθεσιμότητα πριν πας.' : 'AI-generated from real ChalkidikiHub places. Check hours & availability before you go.'}
          </p>
        </div>
      )}
    </div>
  );
}
