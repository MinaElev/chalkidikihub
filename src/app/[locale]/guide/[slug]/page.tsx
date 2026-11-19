import { editorialRoute } from '@/features/editorial/route';
import { ComparisonTable } from '@/features/editorial/ComparisonTable';
import { guides } from '@/lib/editorial';

export const revalidate = 86400;
export const dynamicParams = false;

const route = editorialRoute({
  list: guides, base: '/guide', param: 'slug', sectionKey: 'secPlan', sectionHref: '/guide', useOverrides: true,
  top: (slug, locale) => <ComparisonTable slug={slug} locale={locale} />,
});
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
