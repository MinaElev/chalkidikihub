import Image from 'next/image';

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Narrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-3xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

/** Page heading block: breadcrumbs slot, h1, lead paragraph. */
export function PageIntro({
  breadcrumbs, title, lead, children,
}: {
  breadcrumbs?: React.ReactNode;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="pb-8 pt-6">
      {breadcrumbs}
      <h1 className="mt-4 max-w-4xl font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {lead && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">{lead}</p>}
      {children}
    </div>
  );
}

/** Full-bleed photo header for detail pages. The LCP element: priority + exact sizes. */
export function HeroImage({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) return null;
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-sand-100 sm:aspect-[21/9]">
      <Image src={src} alt={alt} fill priority fetchPriority="high" sizes="(min-width: 1280px) 1232px, 100vw" className="object-cover" />
    </div>
  );
}

export function Section({
  id, title, intro, action, children, className = '',
}: {
  id?: string;
  title: string;
  intro?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`mt-14 ${className}`}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-3xl">
          <h2 id={id} className="font-display text-2xl font-semibold text-slate-900">
            {title}
          </h2>
          {intro && <p className="mt-2 text-slate-600">{intro}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Prose({ html, className = '' }: { html: string; className?: string }) {
  if (!html) return null;
  return <div className={`prose-ch ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function FactList({ items }: { items: Array<{ label: string; value: React.ReactNode }> }) {
  const shown = items.filter((i) => i.value !== null && i.value !== undefined && i.value !== '');
  if (!shown.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-slate-200 bg-sand-50 p-5 text-sm">
      {shown.map((i) => (
        <div key={i.label}>
          <dt className="text-slate-500">{i.label}</dt>
          <dd className="mt-0.5 font-medium text-slate-900">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
