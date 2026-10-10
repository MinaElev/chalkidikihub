'use client';

import { useRef, useState } from 'react';
import { Eye, EyeOff, Loader2, type LucideIcon } from 'lucide-react';

/* ── Shared input chrome ──────────────────────────────────────────────
   One ring/border treatment for every control on the auth pages, so the
   focus state reads identically whether it wraps an <input>, the phone
   group or a code box. */
const BOX =
  'w-full bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 ' +
  'outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10';

export function Field({
  label, icon: Icon, action, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: LucideIcon;
  /** Rendered on the label row, right-aligned (e.g. "Forgot your password?"). */
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 gap-3">
        <label htmlFor={props.id} className="block text-[13px] font-semibold text-gray-700">{label}</label>
        {action}
      </div>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 group-focus-within:text-primary-600 transition-colors pointer-events-none" />
        <input {...props} className={`${BOX} pl-11 pr-4 py-3`} />
      </div>
    </div>
  );
}

export function PasswordField({
  label, icon: Icon, showLabel, hideLabel, action, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: LucideIcon;
  showLabel: string;
  hideLabel: string;
  action?: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 gap-3">
        <label htmlFor={props.id} className="block text-[13px] font-semibold text-gray-700">{label}</label>
        {action}
      </div>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 group-focus-within:text-primary-600 transition-colors pointer-events-none" />
        <input {...props} type={visible ? 'text' : 'password'} className={`${BOX} pl-11 pr-11 py-3`} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? hideLabel : showLabel}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {visible ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
        </button>
      </div>
    </div>
  );
}

/* ── Phone ────────────────────────────────────────────────────────────
   Greece first, then the markets the site already serves in its own
   locales, then the rest of the usual visitor origins. */
export const DIAL_CODES = [
  ['GR', '+30'], ['CY', '+357'], ['DE', '+49'], ['RO', '+40'],
  ['RS', '+381'], ['BG', '+359'], ['RU', '+7'], ['MK', '+389'],
  ['GB', '+44'], ['AT', '+43'], ['NL', '+31'], ['PL', '+48'],
  ['FR', '+33'], ['IT', '+39'], ['TR', '+90'], ['IL', '+972'],
] as const;

export const DEFAULT_DIAL = '+30';

/** Digits only, no leading zero — owners type "0694…" out of habit. */
export const normalizePhone = (dial: string, national: string) =>
  `${dial}${national.replace(/\D/g, '').replace(/^0+/, '')}`;

export const isValidPhone = (national: string) => {
  const digits = national.replace(/\D/g, '').replace(/^0+/, '');
  return digits.length >= 6 && digits.length <= 14;
};

export function PhoneField({
  label, help, placeholder, countryCodeLabel, dial, onDialChange, value, onChange, id,
}: {
  label: string;
  help: string;
  placeholder: string;
  countryCodeLabel: string;
  dial: string;
  onDialChange: (d: string) => void;
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="flex items-stretch bg-gray-50 border border-gray-200 rounded-xl overflow-hidden transition-all focus-within:bg-white focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10">
        <div className="relative flex items-center shrink-0">
          <select
            aria-label={countryCodeLabel}
            value={dial}
            onChange={(e) => onDialChange(e.target.value)}
            className="appearance-none bg-transparent outline-none cursor-pointer font-semibold text-gray-700 text-[15px] py-3 pl-3.5 pr-8"
          >
            {DIAL_CODES.map(([iso, code]) => (
              <option key={iso} value={code}>{iso} {code}</option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute right-2.5 w-4 h-4 text-gray-400 pointer-events-none">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        <span className="w-px bg-gray-200 my-2.5" aria-hidden="true" />
        <input
          id={id}
          type="tel"
          required
          autoComplete="tel-national"
          inputMode="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-gray-900 placeholder:text-gray-400 px-3.5 py-3"
        />
      </div>
      <p className="mt-1.5 text-[11.5px] text-gray-400 leading-relaxed">{help}</p>
    </div>
  );
}

/* ── One-time code ───────────────────────────────────────────────────
   Four boxes instead of one letter-spaced input: auto-advance, backspace
   walks back, and a pasted code fills every box at once. */
export function OtpInput({
  value, onChange, label, length = 4, onComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  length?: number;
  onComplete?: (code: string) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  // The code is always a prefix — no holes. Typing replaces or appends at `i`,
  // clearing a box drops it and everything after, so `value.length` is both the
  // digit count and the index of the next empty box.
  //
  // `digits` can be longer than one character: a fast typist lands two
  // keystrokes in the same box before focus moves, and autofill drops the whole
  // code into the first one. Both spill forward instead of being swallowed —
  // which is also why the boxes carry no maxLength.
  const setDigit = (i: number, digits: string) => {
    if (!digits) {
      commit(value.slice(0, i));
      return;
    }
    commit((value.slice(0, i) + digits + value.slice(i + digits.length)).slice(0, length));
    refs.current[Math.min(i + digits.length, length - 1)]?.focus();
  };

  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="flex justify-center gap-3 max-w-[340px] mx-auto">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            value={value[i] || ''}
            aria-label={`${label} ${i + 1}`}
            // Selecting on focus makes going back to fix one digit replace it
            // rather than append next to it.
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, '').slice(0, length))}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
              if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
              if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
              if (!pasted) return;
              commit(pasted);
              refs.current[Math.min(pasted.length, length - 1)]?.focus();
            }}
            className="flex-1 min-w-0 max-w-[74px] h-[82px] text-center text-[34px] leading-none font-extrabold text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none transition-all focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          />
        ))}
      </div>
    </fieldset>
  );
}

/* ── Password strength ───────────────────────────────────────────────
   Deliberately coarse: it nudges, it never blocks. Supabase still enforces
   the 6-character minimum. */
export function passwordScore(pw: string): 0 | 1 | 2 | 3 {
  if (pw.length < 6) return pw.length === 0 ? 0 : 1;
  let score = 1;
  if (pw.length >= 10) score++;
  if (/[^a-zA-Z]/.test(pw) && /[a-zA-Z]/.test(pw)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

export function StrengthMeter({ score, labels }: { score: 0 | 1 | 2 | 3; labels: [string, string, string] }) {
  const tone = ['bg-red-400', 'bg-amber-400', 'bg-green-500'][Math.max(score - 1, 0)];
  const text = ['text-red-500', 'text-amber-600', 'text-green-600'][Math.max(score - 1, 0)];
  return (
    <div className="flex items-center gap-1.5" aria-live="polite">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${score >= i ? tone : 'bg-gray-200'}`} />
      ))}
      <span className={`text-[11px] font-semibold ml-1.5 w-16 ${score ? text : 'text-transparent'}`}>
        {score ? labels[score - 1] : '—'}
      </span>
    </div>
  );
}

export function SubmitButton({ loading, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      type="submit"
      disabled={loading || props.disabled}
      className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg shadow-primary-600/25 transition-all hover:shadow-xl hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Alert({ tone, children }: { tone: 'error' | 'success'; children: React.ReactNode }) {
  const styles = tone === 'error'
    ? 'bg-red-50 border-red-200 text-red-600'
    : 'bg-green-50 border-green-200 text-green-700';
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`mb-4 p-3 border rounded-xl text-sm ${styles}`}>
      {children}
    </div>
  );
}
