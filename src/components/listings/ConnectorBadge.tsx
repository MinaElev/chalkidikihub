'use client';

import { useTranslations } from 'next-intl';
import { ConnectorInfo } from '@/types';
import { Zap, Circle } from 'lucide-react';

const statusColors = {
  available: 'bg-green-100 text-green-800 border-green-200',
  occupied: 'bg-amber-100 text-amber-800 border-amber-200',
  offline: 'bg-red-100 text-red-800 border-red-200',
};

const statusDot = {
  available: 'bg-green-500',
  occupied: 'bg-amber-500',
  offline: 'bg-red-500',
};

export function ConnectorBadge({ connector }: { connector: ConnectorInfo }) {
  const tConn = useTranslations('connectorTypes');
  const tSpeed = useTranslations('chargerSpeeds');
  const t = useTranslations('evChargers');

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${statusColors[connector.status]}`}>
      <div className="flex items-center gap-3">
        <Zap className="w-5 h-5" />
        <div>
          <div className="font-medium">{tConn(connector.type)}</div>
          <div className="text-xs opacity-75">
            {connector.power_kw} kW - {tSpeed(connector.speed)} - x{connector.count}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <div className={`w-2 h-2 rounded-full ${statusDot[connector.status]}`} />
        {connector.status === 'available' && t('statusAvailable')}
        {connector.status === 'occupied' && t('statusOccupied')}
        {connector.status === 'offline' && t('statusOffline')}
      </div>
    </div>
  );
}
