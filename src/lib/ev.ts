import 'server-only';

/**
 * EV charging points around Halkidiki from Open Charge Map. Only what OCM
 * actually records is shown — v3 filled gaps with invented values (a 4.0
 * rating, 0.45 €/kWh, a "Type 2 · 22 kW" connector) that drivers could act on.
 */

export type Connector = { type: string; kw: number | null; count: number };
export type Charger = {
  id: number;
  title: string;
  town: string | null;
  latitude: number;
  longitude: number;
  operator: string | null;
  points: number | null;
  usageCost: string | null;
  connectors: Connector[];
};

const TYPES: Record<number, string> = {
  1: 'Type 1', 2: 'CHAdeMO', 25: 'Type 2', 27: 'Tesla', 28: 'Schuko', 30: 'Tesla (Destination)', 32: 'CCS1', 33: 'CCS2', 1036: 'Type 2 (tethered)',
};

type Poi = {
  ID: number;
  AddressInfo: { Title?: string; Town?: string; Latitude: number; Longitude: number };
  OperatorInfo?: { Title?: string };
  OperatorID?: number;
  UsageCost?: string;
  NumberOfPoints?: number;
  Connections?: Array<{ ConnectionTypeID?: number; PowerKW?: number; Quantity?: number }>;
};

export async function getChargers(): Promise<Charger[]> {
  const key = process.env.NEXT_PUBLIC_OCM_API_KEY;
  if (!key) return [];
  const url = new URL('https://api.openchargemap.io/v3/poi/');
  Object.entries({
    output: 'json', countrycode: 'GR', latitude: '40.15', longitude: '23.6', distance: '60', distanceunit: 'KM',
    maxresults: '200', compact: 'false', verbose: 'false', key,
  }).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    const res = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = (await res.json()) as Poi[];
    const seen = new Set<number>();
    return data
      .filter((p) => (seen.has(p.ID) ? false : (seen.add(p.ID), true)))
      .map((p) => ({
        id: p.ID,
        title: p.AddressInfo.Title?.trim() || p.AddressInfo.Town || `#${p.ID}`,
        town: p.AddressInfo.Town?.trim() || null,
        latitude: p.AddressInfo.Latitude,
        longitude: p.AddressInfo.Longitude,
        operator: p.OperatorInfo?.Title && !/unknown/i.test(p.OperatorInfo.Title) ? p.OperatorInfo.Title : null,
        points: p.NumberOfPoints ?? null,
        usageCost: p.UsageCost?.trim() || null,
        connectors: (p.Connections ?? [])
          .filter((c) => c.ConnectionTypeID && TYPES[c.ConnectionTypeID])
          .map((c) => ({ type: TYPES[c.ConnectionTypeID!], kw: c.PowerKW ?? null, count: c.Quantity ?? 1 })),
      }));
  } catch {
    return [];
  }
}
