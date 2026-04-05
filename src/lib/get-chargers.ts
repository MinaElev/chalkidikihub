import { EvCharger, Area } from '@/types';
import { fetchChargersFromOCM } from './ocm-api';

let cachedChargers: EvCharger[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function getChargers(area?: Area): Promise<EvCharger[]> {
  const now = Date.now();
  if (!cachedChargers || now - cacheTime > CACHE_DURATION) {
    const liveChargers = await fetchChargersFromOCM();
    if (liveChargers.length > 0) {
      cachedChargers = liveChargers;
      cacheTime = now;
    }
  }

  const chargers = cachedChargers || [];

  if (area) {
    return chargers.filter((c) => c.area === area);
  }

  return chargers;
}
