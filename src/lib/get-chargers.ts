import { EvCharger, Area } from '@/types';
import { fetchChargersFromOCM } from './ocm-api';
import { seedChargers } from './seed-chargers';

let cachedChargers: EvCharger[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function getChargers(area?: Area): Promise<EvCharger[]> {
  // Try to get live data from OCM
  const now = Date.now();
  if (!cachedChargers || now - cacheTime > CACHE_DURATION) {
    const liveChargers = await fetchChargersFromOCM();
    if (liveChargers.length > 0) {
      cachedChargers = liveChargers;
      cacheTime = now;
    }
  }

  // Use live data if available, otherwise seed data
  const chargers = (cachedChargers && cachedChargers.length > 0) ? cachedChargers : seedChargers;

  if (area) {
    return chargers.filter((c) => c.area === area);
  }

  return chargers;
}

export function getChargersSync(area?: Area): EvCharger[] {
  // For client components that can't use async - always use seed data
  // Live data is fetched on server components
  const chargers = seedChargers;
  if (area) {
    return chargers.filter((c) => c.area === area);
  }
  return chargers;
}
