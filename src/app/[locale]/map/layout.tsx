import { ClientIntl } from '@/components/ClientIntl';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientIntl namespaces={['map', 'beachFeatures', 'cuisineTypes', 'activityCategories']}>{children}</ClientIntl>;
}
