import { privateMetadata } from '@/lib/seo/metadata';
import { ClientIntlAll } from '@/components/ClientIntlAll';

export const metadata = privateMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientIntlAll>{children}</ClientIntlAll>;
}
