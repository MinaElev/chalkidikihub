export type Area = 'kassandra' | 'sithonia' | 'athos' | 'mainland';

export type ListingStatus = 'draft' | 'published' | 'archived';

export type Amenity =
  | 'wifi'
  | 'parking'
  | 'airConditioning'
  | 'pool'
  | 'kitchen'
  | 'tv'
  | 'washingMachine'
  | 'balcony'
  | 'seaView'
  | 'garden'
  | 'bbq'
  | 'petsAllowed';

export interface Listing {
  id: string;
  slug: string;
  owner_id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  area: Area;
  location_name: string;
  latitude: number;
  longitude: number;
  price_per_night: number;
  currency: string;
  guests_max: number;
  bedrooms: number;
  bathrooms: number;
  amenities: Amenity[];
  status: ListingStatus;
  images: ListingImage[];
  created_at: string;
  updated_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  sort_order: number;
  is_cover: boolean;
}

export interface AreaInfo {
  id: string;
  slug: Area;
  name: Record<string, string>;
  description: Record<string, string>;
  image_url: string;
  latitude: number;
  longitude: number;
  listings_count: number;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: 'owner' | 'admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  area?: Area;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  amenities?: Amenity[];
  sort?: 'newest' | 'price_low' | 'price_high';
}

// Beach types

export type BeachFeature =
  | 'sandy'
  | 'pebble'
  | 'organized'
  | 'free'
  | 'parking'
  | 'beachBar'
  | 'shallowWater'
  | 'waterSports'
  | 'accessible'
  | 'sunbeds'
  | 'lifeguard'
  | 'nudist';

export interface Beach {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  area: Area;
  location_name: string;
  latitude: number;
  longitude: number;
  image_url: string;
  features: BeachFeature[];
  rating: number;
  reviews_count: number;
  reviews: BeachReview[];
  nearby_listing_ids: string[];
}

export interface BeachReview {
  id: string;
  beach_id: string;
  author_name: string;
  rating: number;
  comment: Record<string, string>;
  created_at: string;
}

export interface BeachFilters {
  area?: Area;
  features?: BeachFeature[];
  sort?: 'rating' | 'name' | 'reviews';
}

// Restaurant types

// Dynamic — managed in DB table business_types
export type CuisineType = string;

export type PriceLevel = 'budget' | 'moderate' | 'upscale' | 'fineDining';

export interface Restaurant {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  area: Area;
  location_name: string;
  latitude: number;
  longitude: number;
  image_url: string;
  cuisine: CuisineType[];
  price_level: PriceLevel;
  rating: number;
  reviews_count: number;
  reviews: RestaurantReview[];
  phone: string;
  hours: string;
  has_sea_view: boolean;
  has_live_music: boolean;
  accepts_reservations: boolean;
  tags: string[];
  nearby_listing_ids: string[];
  nearby_beach_ids: string[];
}

export interface RestaurantReview {
  id: string;
  restaurant_id: string;
  author_name: string;
  rating: number;
  comment: Record<string, string>;
  created_at: string;
}

export interface RestaurantFilters {
  area?: Area;
  cuisine?: CuisineType;
  priceLevel?: PriceLevel;
  seaView?: boolean;
  sort?: 'rating' | 'name' | 'reviews' | 'price';
}

// Activity/Attraction types

export type ActivityCategory = 'historical' | 'nature' | 'waterSports' | 'boatTrips' | 'wellness' | 'family' | 'nightlife' | 'religious';

export interface Activity {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  area: Area;
  location_name: string;
  latitude: number;
  longitude: number;
  image_url: string;
  category: ActivityCategory;
  price_range: string;
  duration: string;
  rating: number;
  reviews_count: number;
  reviews: ActivityReview[];
  tags: string[];
  nearby_listing_ids: string[];
  nearby_beach_ids: string[];
}

export interface ActivityReview {
  id: string;
  activity_id: string;
  author_name: string;
  rating: number;
  comment: Record<string, string>;
  created_at: string;
}

export interface ActivityFilters {
  area?: Area;
  category?: ActivityCategory;
  sort?: 'rating' | 'name' | 'reviews';
}

// EV Charger types

export type ConnectorType = 'type2' | 'ccs' | 'chademo' | 'schuko';

export type ChargerSpeed = 'slow' | 'fast' | 'rapid';

export type ChargerStatus = 'available' | 'occupied' | 'offline';

export interface EvCharger {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  area: Area;
  location_name: string;
  latitude: number;
  longitude: number;
  image_url: string;
  provider: string;
  connectors: ConnectorInfo[];
  total_spots: number;
  cost_per_kwh: number | null;
  free_charging: boolean;
  hours: string;
  rating: number;
  reviews_count: number;
  nearby_listing_ids: string[];
  nearby_beach_ids: string[];
}

export interface ConnectorInfo {
  type: ConnectorType;
  power_kw: number;
  speed: ChargerSpeed;
  count: number;
  status: ChargerStatus;
}

// Blog types

export type BlogCategory = 'guides' | 'beaches' | 'food' | 'activities' | 'tips' | 'culture';

export interface BlogArticle {
  id: string;
  slug: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  category: BlogCategory;
  image_url: string;
  author: string;
  read_time_min: number;
  tags: string[];
  related_area_slugs: Area[];
  related_beach_slugs: string[];
  related_listing_slugs: string[];
  related_article_slugs: string[];
  published_at: string;
  updated_at?: string;
}

export interface BlogFilters {
  category?: BlogCategory;
  area?: Area;
  sort?: 'newest' | 'popular';
}

export interface EvChargerFilters {
  area?: Area;
  connector?: ConnectorType;
  speed?: ChargerSpeed;
  freeOnly?: boolean;
  sort?: 'rating' | 'power' | 'name';
}

export type SubmissionType = 'restaurant' | 'activity' | 'blog';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface UserSubmission {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  user_id: string;
  title_el: string;
  title_en: string;
  description_el: string;
  description_en: string;
  area: string | null;
  location_name: string;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  category: string;
  extra_data: Record<string, unknown>;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined from profiles
  user_name?: string;
  user_email?: string;
}

// Sales / Real Estate
export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial' | 'other';
export type SaleFeature = 'parking' | 'pool' | 'garden' | 'sea_view' | 'furnished' | 'elevator' | 'storage' | 'fireplace' | 'solar' | 'alarm' | 'air_conditioning' | 'central_heating';

export interface Sale {
  id: string;
  slug: string;
  owner_id: string;
  property_type: PropertyType;
  title: Record<string, string>;
  description: Record<string, string>;
  area: Area;
  location_name: string;
  latitude: number;
  longitude: number;
  price: number;
  currency: string;
  size_sqm: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  year_built: number;
  energy_class: string;
  features: SaleFeature[];
  status: ListingStatus;
  images: SaleImage[];
  contact_phone: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
}

export interface SaleImage {
  id: string;
  sale_id: string;
  image_url: string;
  sort_order: number;
  is_cover: boolean;
}

export interface SaleFilters {
  area?: Area;
  property_type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  bedrooms?: number;
  sort?: 'newest' | 'price_low' | 'price_high' | 'size';
}
