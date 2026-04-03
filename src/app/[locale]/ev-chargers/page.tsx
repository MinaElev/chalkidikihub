'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect } from 'react';
import { seedChargers } from '@/lib/seed-chargers';
import { ChargerCard } from '@/components/listings/ChargerCard';
import { EvChargerFilters, EvCharger, Area, ConnectorType, ChargerSpeed } from '@/types';
import { AREA_SLUGS, ALL_CONNECTOR_TYPES, ALL_CHARGER_SPEEDS } from '@/lib/constants';
import { X, Loader2 } from 'lucide-react';

export default function EvChargersPage() {
  const t = useTranslations('evChargers');
  const tAreas = useTranslations('areas');
  const tConn = useTranslations('connectorTypes');
  const tSpeed = useTranslations('chargerSpeeds');
  const tCommon = useTranslations('common');
  const [filters, setFilters] = useState<EvChargerFilters>({});
  const [chargers, setChargers] = useState<EvCharger[]>(seedChargers);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OCM_API_KEY;
    if (!apiKey) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const url = `https://api.openchargemap.io/v3/poi/?output=json&countrycode=GR&latitude=40.15&longitude=23.6&distance=60&distanceunit=KM&maxresults=100&compact=true&verbose=false&key=${apiKey}`;

    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: Array<Record<string, unknown>>) => {
        if (!Array.isArray(data) || data.length === 0) return;

        const mapped: EvCharger[] = data.map((poi: Record<string, unknown>) => {
          const addr = poi.AddressInfo as Record<string, unknown>;
          const lat = addr.Latitude as number;
          const lng = addr.Longitude as number;
          const title = (addr.Title as string) || 'EV Charger';
          const town = (addr.Town as string) || '';
          const operator = (poi.OperatorInfo as Record<string, unknown>)?.Title as string || '';
          const usageCost = (poi.UsageCost as string) || '';
          const isFree = usageCost.toLowerCase().includes('free') || usageCost.includes('δωρεάν');
          const costMatch = usageCost.match(/(\d+[.,]\d+)/);
          const costPerKwh = costMatch ? parseFloat(costMatch[1].replace(',', '.')) : (isFree ? null : 0.45);

          // Determine area
          let area: Area = 'mainland';
          if (lat < 40.05 && lng < 23.65) area = 'kassandra';
          else if (lat < 40.05 && lng >= 23.65) area = 'sithonia';
          else if (lat >= 40.05 && lat < 40.15 && lng < 23.65) area = 'kassandra';
          else if (lat >= 40.05 && lat < 40.25 && lng >= 23.65) area = 'sithonia';
          else if (lng > 23.85) area = 'athos';

          // Map connectors
          const connMap: Record<number, string> = { 25: 'type2', 33: 'ccs', 2: 'chademo', 28: 'schuko', 1: 'type2', 27: 'type2', 30: 'type2', 32: 'ccs' };
          const connections = (poi.Connections as Array<Record<string, unknown>>) || [];
          const connectors = connections
            .filter((c) => connMap[c.ConnectionTypeID as number])
            .map((c) => ({
              type: connMap[c.ConnectionTypeID as number] as EvCharger['connectors'][number]['type'],
              power_kw: (c.PowerKW as number) || 0,
              speed: ((c.PowerKW as number) >= 50 ? 'rapid' : (c.PowerKW as number) >= 7 ? 'fast' : 'slow') as EvCharger['connectors'][number]['speed'],
              count: (c.Quantity as number) || 1,
              status: 'available' as const,
            }));

          if (connectors.length === 0) {
            connectors.push({ type: 'type2', power_kw: 22, speed: 'fast', count: 1, status: 'available' });
          }

          const nameObj = { el: title, en: title, de: title, bg: title, ru: title, ro: title };
          const descEl = `Σταθμός φόρτισης ${operator || 'EV'} - ${town || 'Χαλκιδική'}`;
          const descEn = `${operator || 'EV'} charging station - ${town || 'Halkidiki'}`;

          return {
            id: `ocm-${poi.ID}`,
            slug: `ocm-${poi.ID}`,
            name: nameObj,
            description: { el: descEl, en: descEn, de: descEn, bg: descEn, ru: descEn, ro: descEn },
            area,
            location_name: [town, title].filter(Boolean).join(', '),
            latitude: lat,
            longitude: lng,
            image_url: '',
            provider: operator || 'Unknown',
            connectors,
            total_spots: (poi.NumberOfPoints as number) || connectors.reduce((s, c) => s + c.count, 0),
            cost_per_kwh: costPerKwh,
            free_charging: isFree,
            hours: '24/7',
            rating: 4.0,
            reviews_count: 0,
            nearby_listing_ids: [],
            nearby_beach_ids: [],
          } as EvCharger;
        });

        if (mapped.length > 0) {
          setChargers(mapped);
          setIsLive(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'),
    sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'),
    mainland: tAreas('mainlandHalkidiki.name'),
  };

  const filtered = useMemo(() => {
    let result = [...chargers];

    if (filters.area) {
      result = result.filter((c) => c.area === filters.area);
    }
    if (filters.connector) {
      result = result.filter((c) => c.connectors.some((cn) => cn.type === filters.connector));
    }
    if (filters.speed) {
      result = result.filter((c) => c.connectors.some((cn) => cn.speed === filters.speed));
    }
    if (filters.freeOnly) {
      result = result.filter((c) => c.free_charging);
    }

    switch (filters.sort) {
      case 'power':
        result.sort((a, b) => Math.max(...b.connectors.map((c) => c.power_kw)) - Math.max(...a.connectors.map((c) => c.power_kw)));
        break;
      case 'name':
        result.sort((a, b) => a.name.en.localeCompare(b.name.en));
        break;
      default:
        result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [filters, chargers]);

  const hasActive = filters.area || filters.connector || filters.speed || filters.freeOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          {isLive && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              LIVE
            </span>
          )}
        </div>
        <p className="mt-1 text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap mb-8">
        <select
          value={filters.area || ''}
          onChange={(e) => setFilters({ ...filters, area: e.target.value as Area || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t('filters.allAreas')}</option>
          {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
        </select>

        <select
          value={filters.connector || ''}
          onChange={(e) => setFilters({ ...filters, connector: e.target.value as ConnectorType || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t('filters.allConnectors')}</option>
          {ALL_CONNECTOR_TYPES.map((c) => <option key={c} value={c}>{tConn(c)}</option>)}
        </select>

        <select
          value={filters.speed || ''}
          onChange={(e) => setFilters({ ...filters, speed: e.target.value as ChargerSpeed || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t('filters.allSpeeds')}</option>
          {ALL_CHARGER_SPEEDS.map((s) => <option key={s} value={s}>{tSpeed(s)}</option>)}
        </select>

        <select
          value={filters.sort || 'rating'}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value as EvChargerFilters['sort'] })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="rating">{t('filters.sortRating')}</option>
          <option value="power">{t('filters.sortPower')}</option>
          <option value="name">{t('filters.sortName')}</option>
        </select>

        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={filters.freeOnly || false}
            onChange={(e) => setFilters({ ...filters, freeOnly: e.target.checked || undefined })}
            className="rounded text-green-600 focus:ring-green-500"
          />
          {t('filters.freeOnly')}
        </label>

        {hasActive && (
          <button
            onClick={() => setFilters({})}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <X className="w-4 h-4" />
            {t('filters.clearFilters')}
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((charger) => (
            <ChargerCard key={charger.id} charger={charger} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-500">{tCommon('noResults')}</p>
        </div>
      )}
    </div>
  );
}
