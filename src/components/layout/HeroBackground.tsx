'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function HeroBackground() {
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    fetch('/api/settings/hero-image')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.url) setHeroImage(data.url); })
      .catch(() => {});
  }, []);

  if (heroImage) {
    return <Image src={heroImage} alt="Halkidiki" fill priority sizes="100vw" className="object-cover opacity-40" />;
  }

  // Subtle dot pattern fallback
  return (
    <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
  );
}
