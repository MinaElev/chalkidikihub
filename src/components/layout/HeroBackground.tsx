'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const DEFAULT_HERO = '/images/hero/halkidiki-hero.webp';

export function HeroBackground() {
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO);

  useEffect(() => {
    fetch('/api/settings/hero-image')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.url) setHeroImage(data.url); })
      .catch(() => {});
  }, []);

  return (
    <Image
      src={heroImage}
      alt="Halkidiki, Greece — turquoise waters and pine trees"
      fill
      priority
      sizes="100vw"
      className="object-cover opacity-50"
    />
  );
}
