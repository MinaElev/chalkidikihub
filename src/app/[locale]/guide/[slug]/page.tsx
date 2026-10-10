import { editorialRoute } from '@/features/editorial/route';
import { guides } from '@/lib/editorial';

export const revalidate = 86400;
export const dynamicParams = false;

const route = editorialRoute({ list: guides, base: '/guide', param: 'slug', sectionKey: 'secPlan', sectionHref: '/guide', useOverrides: true });
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
