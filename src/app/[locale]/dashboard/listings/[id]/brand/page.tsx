import { redirect } from '@/i18n/navigation';

/**
 * The old "Site καταλύματος" page. Its sections now live on the edit page, so
 * old links (emails, bookmarks) land there, at "Για εσάς".
 */
export default async function BrandPage(props: PageProps<'/[locale]/dashboard/listings/[id]/brand'>) {
  const { locale, id } = await props.params;
  redirect({ href: `/dashboard/listings/${id}/edit#about`, locale });
}
