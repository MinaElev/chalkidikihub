import { EvCharger, ConnectorType, ChargerSpeed, ConnectorInfo, Area } from '@/types';

const OCM_API_BASE = 'https://api.openchargemap.io/v3/poi/';
const OCM_API_KEY = process.env.NEXT_PUBLIC_OCM_API_KEY || '';

// Halkidiki bounding box centers for each area
// Single center point for all of Halkidiki with large radius
const HALKIDIKI_CENTER = { lat: 40.15, lng: 23.6, radius: 60 };

const AREA_COORDS: Record<Area, { lat: number; lng: number; radius: number }> = {
  kassandra: { lat: 39.99, lng: 23.45, radius: 30 },
  sithonia: { lat: 40.1, lng: 23.8, radius: 30 },
  athos: { lat: 40.35, lng: 24.0, radius: 25 },
  mainland: { lat: 40.25, lng: 23.3, radius: 25 },
};

// Map OCM connector type IDs to our types
function mapConnectorType(ocmTypeId: number): ConnectorType | null {
  const map: Record<number, ConnectorType> = {
    25: 'type2',     // Type 2 (Mennekes)
    33: 'ccs',       // CCS (Type 2)
    2: 'chademo',    // CHAdeMO
    28: 'schuko',    // Schuko (CEE 7/4)
    1: 'type2',      // Type 1 -> map to type2
    32: 'ccs',       // CCS (Type 1)
    27: 'type2',     // Tesla Supercharger (Type 2)
    30: 'type2',     // Tesla Destination
  };
  return map[ocmTypeId] || null;
}

function mapSpeed(powerKw: number): ChargerSpeed {
  if (powerKw >= 50) return 'rapid';
  if (powerKw >= 7) return 'fast';
  return 'slow';
}

function determineArea(lat: number, lng: number): Area {
  // Simple distance-based area detection for Halkidiki
  if (lat < 40.05 && lng < 23.65) return 'kassandra';
  if (lat < 40.05 && lng >= 23.65) return 'sithonia';
  if (lat >= 40.05 && lng < 23.65 && lat < 40.15) return 'kassandra';
  if (lat >= 40.05 && lat < 40.25 && lng >= 23.65) return 'sithonia';
  if (lng > 23.85) return 'athos';
  return 'mainland';
}

interface OcmPoi {
  ID: number;
  AddressInfo: {
    Title: string;
    AddressLine1?: string;
    Town?: string;
    Latitude: number;
    Longitude: number;
  };
  OperatorInfo?: {
    Title: string;
  };
  UsageCost?: string;
  Connections?: Array<{
    ConnectionTypeID: number;
    ConnectionType?: { Title: string };
    PowerKW?: number;
    Quantity?: number;
    StatusTypeID?: number;
  }>;
  StatusTypeID?: number;
  NumberOfPoints?: number;
  UserComments?: Array<{
    ID: number;
    UserName: string;
    Rating: number;
    Comment: string;
    DateCreated: string;
  }>;
}

function mapOcmToCharger(poi: OcmPoi): EvCharger {
  const lat = poi.AddressInfo.Latitude;
  const lng = poi.AddressInfo.Longitude;
  const area = determineArea(lat, lng);
  const provider = poi.OperatorInfo?.Title || 'Unknown';
  const locationName = [poi.AddressInfo.Town, poi.AddressInfo.Title]
    .filter(Boolean)
    .join(', ');

  const slug = `ocm-${poi.ID}`;
  const title = poi.AddressInfo.Title || `EV Charger - ${poi.AddressInfo.Town || 'Halkidiki'}`;

  // Map connectors
  const connectors: ConnectorInfo[] = (poi.Connections || [])
    .reduce<ConnectorInfo[]>((acc, conn) => {
      const type = mapConnectorType(conn.ConnectionTypeID);
      if (!type) return acc;
      const powerKw = conn.PowerKW || 0;
      acc.push({
        type,
        power_kw: powerKw,
        speed: mapSpeed(powerKw),
        count: conn.Quantity || 1,
        status: conn.StatusTypeID === 50 ? 'available'
          : conn.StatusTypeID === 30 ? 'occupied'
          : 'available',
      });
      return acc;
    }, []);

  // If no valid connectors, add a generic type2
  if (connectors.length === 0) {
    connectors.push({
      type: 'type2',
      power_kw: 22,
      speed: 'fast',
      count: 1,
      status: 'available',
    });
  }

  const isFree = poi.UsageCost?.toLowerCase().includes('free') ||
    poi.UsageCost?.toLowerCase().includes('δωρεάν') || false;

  const costMatch = poi.UsageCost?.match(/(\d+[.,]\d+)/);
  const costPerKwh = costMatch ? parseFloat(costMatch[1].replace(',', '.')) : (isFree ? null : 0.45);

  // Calculate rating from user comments or default
  const ratings = poi.UserComments?.filter((c) => c.Rating > 0).map((c) => c.Rating) || [];
  const rating = ratings.length > 0
    ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
    : 4.0;

  const nameObj = {
    el: title, en: title, de: title, bg: title, ru: title, ro: title,
  };

  const descObj = {
    el: `Σταθμός φόρτισης ${provider} στη ${poi.AddressInfo.Town || 'Χαλκιδική'}. ${connectors.length} σύνδεσμοι διαθέσιμοι.`,
    en: `${provider} charging station in ${poi.AddressInfo.Town || 'Halkidiki'}. ${connectors.length} connectors available.`,
    de: `${provider} Ladestation in ${poi.AddressInfo.Town || 'Chalkidiki'}. ${connectors.length} Anschlüsse verfügbar.`,
    bg: `Зарядна станция ${provider} в ${poi.AddressInfo.Town || 'Халкидики'}. ${connectors.length} конектора налични.`,
    ru: `Зарядная станция ${provider} в ${poi.AddressInfo.Town || 'Халкидики'}. ${connectors.length} разъёмов доступно.`,
    ro: `Stație de încărcare ${provider} în ${poi.AddressInfo.Town || 'Halkidiki'}. ${connectors.length} conectori disponibili.`,
  };

  return {
    id: `ocm-${poi.ID}`,
    slug,
    name: nameObj,
    description: descObj,
    area,
    location_name: locationName,
    latitude: lat,
    longitude: lng,
    image_url: '',
    provider,
    connectors,
    total_spots: poi.NumberOfPoints || connectors.reduce((sum, c) => sum + c.count, 0),
    cost_per_kwh: costPerKwh,
    free_charging: isFree,
    hours: '24/7',
    rating,
    reviews_count: poi.UserComments?.length || 0,
    nearby_listing_ids: [],
    nearby_beach_ids: [],
  };
}

export async function fetchChargersFromOCM(
  area?: Area,
  maxResults: number = 50
): Promise<EvCharger[]> {
  if (!OCM_API_KEY) {
    console.warn('OCM API key not set, using seed data');
    return [];
  }

  try {
    // If specific area requested, use area coords; otherwise search all Halkidiki
    const coords = area ? AREA_COORDS[area] : HALKIDIKI_CENTER;
    const limit = area ? maxResults : 100; // Get up to 100 for all Halkidiki

    const url = new URL(OCM_API_BASE);
    url.searchParams.set('output', 'json');
    url.searchParams.set('countrycode', 'GR');
    url.searchParams.set('latitude', coords.lat.toString());
    url.searchParams.set('longitude', coords.lng.toString());
    url.searchParams.set('distance', coords.radius.toString());
    url.searchParams.set('distanceunit', 'KM');
    url.searchParams.set('maxresults', limit.toString());
    url.searchParams.set('compact', 'true');
    url.searchParams.set('verbose', 'false');
    url.searchParams.set('key', OCM_API_KEY);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error('OCM API error:', response.status);
      return [];
    }

    const data: OcmPoi[] = await response.json();
    const chargers = data.map(mapOcmToCharger);

    // Deduplicate by ID
    const seen = new Set<string>();
    return chargers.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  } catch (error) {
    console.error('Failed to fetch from OCM API:', error);
    return [];
  }
}
