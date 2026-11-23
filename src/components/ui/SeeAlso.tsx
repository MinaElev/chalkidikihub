import { Link } from '@/i18n/navigation';

/** "See also" links to curated lists the page's item belongs to. */
export function SeeAlso({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  if (!links.length) return null;
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold text-slate-900">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block rounded-full border border-sea-200 bg-white px-3 py-1.5 text-sm font-medium text-sea-800 hover:bg-sea-50">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
