import { ClientIntl } from '@/components/ClientIntl';

// Client components below read these message namespaces.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientIntl namespaces={['availabilityRequest','common']}>{children}</ClientIntl>;
}
