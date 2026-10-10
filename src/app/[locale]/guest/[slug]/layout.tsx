import { ClientIntl } from '@/components/ClientIntl';

// Client components below read these message namespaces.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientIntl namespaces={['activities','activityCategories','beachFeatures','beaches','priceLevels','restaurants','cuisineTypes','common']}>{children}</ClientIntl>;
}
