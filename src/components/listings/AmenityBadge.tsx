'use client';

import { useTranslations } from 'next-intl';
import { Amenity } from '@/types';
import {
  Wifi,
  Car,
  Snowflake,
  Waves,
  CookingPot,
  Tv,
  WashingMachine,
  Sun,
  Eye,
  TreePine,
  Flame,
  PawPrint,
} from 'lucide-react';

const amenityIcons: Record<Amenity, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  airConditioning: Snowflake,
  pool: Waves,
  kitchen: CookingPot,
  tv: Tv,
  washingMachine: WashingMachine,
  balcony: Sun,
  seaView: Eye,
  garden: TreePine,
  bbq: Flame,
  petsAllowed: PawPrint,
};

export function AmenityBadge({ amenity }: { amenity: Amenity }) {
  const t = useTranslations('amenities');
  const Icon = amenityIcons[amenity];

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
      <Icon className="w-4 h-4 text-primary-600" />
      <span>{t(amenity)}</span>
    </div>
  );
}
