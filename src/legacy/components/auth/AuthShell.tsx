import { Check, ShieldCheck } from 'lucide-react';
import { BrandIcon } from '@/legacy/components/ui/BrandLogo';

type Stat = { value: string; label: string };

interface AuthShellProps {
  /** Left panel headline — the reason the visitor is on this page. */
  asideTitle: string;
  asideSub: string;
  bullets: string[];
  stats?: Stat[];
  /** Trust row under the form. Off on pages where it would just be noise. */
  trust?: { encrypted: string; gdpr: string };
  children: React.ReactNode;
}

/**
 * Split-screen frame shared by all four /auth pages: brand + reasons on the
 * left, form on the right.
 *
 * The left panel is `hidden lg:flex` and its photo is a CSS background behind
 * that breakpoint (see `.auth-aside-photo` in globals.css), so phones never
 * download the 186KB hero — an <img> would be fetched even while hidden.
 */
export function AuthShell({ asideTitle, asideSub, bullets, stats, trust, children }: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="relative hidden lg:flex w-[45%] shrink-0 overflow-hidden bg-primary-900">
        <div className="auth-aside-photo absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/80 to-primary-700/60" aria-hidden="true" />

        <div className="relative flex flex-col justify-between gap-10 p-10 xl:p-12 text-white w-full">
          <div className="flex items-center gap-2.5">
            <BrandIcon size={32} />
            <span className="font-extrabold text-lg tracking-tight">ChalkidikiHub</span>
          </div>

          <div>
            <h2 className="text-3xl xl:text-[34px] leading-tight font-extrabold tracking-tight text-balance mb-3">
              {asideTitle}
            </h2>
            <p className="text-[15px] leading-relaxed text-white/75 max-w-sm mb-8">{asideSub}</p>

            <ul className="space-y-3.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-accent-400/20 ring-1 ring-accent-300/40 flex items-center justify-center">
                    <Check className="w-3 h-3 text-accent-300" />
                  </span>
                  <span className="text-sm text-white/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {stats && stats.length > 0 ? (
            <div className="flex items-center gap-9 pt-7 border-t border-white/15">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold tabular-nums">{s.value}</div>
                  <div className="text-[10.5px] uppercase tracking-[0.12em] text-white/55">{s.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div aria-hidden="true" />
          )}
        </div>
      </aside>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-12 lg:py-14 bg-white bg-mesh-light">
        <div className="w-full max-w-[400px]">
          {children}

          {trust && (
            <div className="mt-7 pt-5 border-t border-gray-100 flex items-center justify-center gap-5 text-[11px] text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {trust.encrypted}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                {trust.gdpr}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
