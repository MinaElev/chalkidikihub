import { privateMetadata } from '@/lib/seo/metadata';
import { ClientIntlAll } from '@/components/ClientIntlAll';
import Shell from './_shell';

export const metadata = privateMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientIntlAll>
      <Shell>{children}</Shell>
    </ClientIntlAll>
  );
}
