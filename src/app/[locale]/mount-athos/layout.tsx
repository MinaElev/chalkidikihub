import { setRequestLocale } from 'next-intl/server';
import { MountAthosNav } from './MountAthosNav';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MountAthosLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <MountAthosNav />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
