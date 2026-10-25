import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ChalkidikiHub',
    short_name: 'ChalkidikiHub',
    description: 'Beaches, villages, food and places to stay in Halkidiki, Greece.',
    id: '/',
    start_url: '/',
    scope: '/',
    lang: 'el',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0891B2',
    // Long-press on the installed icon (Android): straight to the most used sections.
    shortcuts: [
      { name: 'Παραλίες · Beaches', url: '/beaches', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Διαμονή · Stays', url: '/listings', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Ζήτα διαθεσιμότητα · Availability', url: '/availability-request', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
    ],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
