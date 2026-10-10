import { editorialRoute } from '@/features/editorial/route';
import { fromCities } from '@/lib/editorial';

export const revalidate = 86400;
export const dynamicParams = false;

const route = editorialRoute({ list: fromCities, base: '/from', param: 'city', sectionKey: 'secFrom', sectionHref: '/from' });
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
