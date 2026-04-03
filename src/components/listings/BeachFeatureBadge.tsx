'use client';

import { useTranslations } from 'next-intl';
import { BeachFeature } from '@/types';
import {
  Sun, Circle, Umbrella, DoorOpen, Car, Wine,
  Waves, Sailboat, Accessibility, Armchair, Shield, Eye,
} from 'lucide-react';

const featureIcons: Record<BeachFeature, React.ComponentType<{ className?: string }>> = {
  sandy: Sun,
  pebble: Circle,
  organized: Umbrella,
  free: DoorOpen,
  parking: Car,
  beachBar: Wine,
  shallowWater: Waves,
  waterSports: Sailboat,
  accessible: Accessibility,
  sunbeds: Armchair,
  lifeguard: Shield,
  nudist: Eye,
};

export function BeachFeatureBadge({ feature }: { feature: BeachFeature }) {
  const t = useTranslations('beachFeatures');
  const Icon = featureIcons[feature];

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-800">
      <Icon className="w-4 h-4 text-blue-600" />
      <span>{t(feature)}</span>
    </div>
  );
}
