import { editorialRoute } from '@/features/editorial/route';
import { costs } from '@/lib/editorial';

export const revalidate = 86400;
export const dynamicParams = false;

const route = editorialRoute({ list: costs, base: '/costs', param: 'topic', sectionKey: 'secCosts', sectionHref: '/guide' });
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
