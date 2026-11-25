import { editorialRoute } from '@/features/editorial/route';
import { DistanceTable, distanceMetaExtra } from '@/features/editorial/DistanceTable';
import { fromCities } from '@/lib/editorial';

export const revalidate = 86400;
// No dynamicParams = false: in Next 16 an on-demand revalidation (admin save) then caches a 404 (NoFallbackError) for every page of the route. Unknown params still 404 via notFound().

const route = editorialRoute({
  list: fromCities, base: '/from', param: 'city', sectionKey: 'secFrom', sectionHref: '/from',
  bottom: (city, locale) => <DistanceTable city={city} locale={locale} />,
  metaExtra: (city, locale) => [distanceMetaExtra(city, locale)],
});
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
