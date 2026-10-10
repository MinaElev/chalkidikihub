import { editorialRoute } from '@/features/editorial/route';
import { itineraries } from '@/lib/editorial';

export const revalidate = 86400;
export const dynamicParams = false;

const route = editorialRoute({ list: itineraries, base: '/itinerary', param: 'days', sectionKey: 'secItineraries', sectionHref: '/guide' });
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
