import { Listing } from '@/types';

export function generateListingJsonLd(listing: Listing, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: listing.title[locale] || listing.title.en,
    description: listing.description[locale] || listing.description.en,
    image: listing.images.find((img) => img.is_cover)?.image_url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.location_name,
      addressRegion: 'Halkidiki',
      addressCountry: 'GR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: listing.latitude,
      longitude: listing.longitude,
    },
    priceRange: `€${listing.price_per_night}`,
    amenityFeature: listing.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    numberOfRooms: listing.bedrooms,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: listing.guests_max,
    },
  };
}

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Halkidiki Hub',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://halkidikihub.com',
    description: 'Find the perfect rental accommodation in Halkidiki, Greece',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://halkidikihub.com'}/en/listings?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
