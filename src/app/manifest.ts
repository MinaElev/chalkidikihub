import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ChalkidikiHub',
    short_name: 'ChalkidikiHub',
    description: 'Beaches, villages, food and places to stay in Halkidiki, Greece.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0e7596',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
