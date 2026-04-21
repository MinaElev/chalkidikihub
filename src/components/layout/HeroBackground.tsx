import Image from 'next/image';
import { cache } from 'react';
import { createApiClient } from '@/lib/api-helpers';

const DEFAULT_HERO = '/images/hero/halkidiki-hero.webp';

const getHeroImageUrl = cache(async (): Promise<string> => {
  try {
    const supabase = createApiClient();
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_image_url')
      .single();
    return (data?.value as string) || DEFAULT_HERO;
  } catch {
    return DEFAULT_HERO;
  }
});

export async function HeroBackground() {
  const heroImage = await getHeroImageUrl();

  return (
    <Image
      src={heroImage}
      alt="Halkidiki, Greece — turquoise waters and pine trees"
      fill
      priority
      fetchPriority="high"
      sizes="100vw"
      quality={60}
      className="object-cover opacity-50"
    />
  );
}
