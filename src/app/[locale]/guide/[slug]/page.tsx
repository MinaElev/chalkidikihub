import { editorialRoute } from '@/features/editorial/route';
import { ComparisonTable } from '@/features/editorial/ComparisonTable';
import { guides } from '@/lib/editorial';

export const revalidate = 86400;
// No dynamicParams = false: in Next 16 an on-demand revalidation (admin save) then caches a 404 (NoFallbackError) for every page of the route. Unknown params still 404 via notFound().

const route = editorialRoute({
  list: guides, base: '/guide', param: 'slug', sectionKey: 'secPlan', sectionHref: '/guide', useOverrides: true,
  top: (slug, locale) => <ComparisonTable slug={slug} locale={locale} />,
});
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
