// app/[locale]/page.tsx

import { HomeFeatureSection } from '@/src/features/home/components/HomeFeatureSection/HomeFeatureSection';
import { HomeHero } from '@/src/features/home/components/HomeHero/HomeHero';
import { HomeNewsSection } from '@/src/features/home/components/HomeNewsSection/HomeNewsSection';
import { HomeProductSection } from '@/src/features/home/components/HomeProductSection/HomeProductSection';

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeNewsSection />
      <HomeFeatureSection />
      <HomeProductSection />
    </main>
  );
}
