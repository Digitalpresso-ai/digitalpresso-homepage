// app/[locale]/references/page.tsx

import { ReferencesHero } from '@/src/features/references/components/ReferencesHero/ReferencesHero';
import { ReferencesServiceSection } from '@/src/features/references/components/ReferencesServiceSection/ReferencesServiceSection';
import { ReferencesKepcoSection } from '@/src/features/references/components/ReferencesKepcoSection/ReferencesKepcoSection';
import { ReferencesElectricalSection } from '@/src/features/references/components/ReferencesElectricalSection/ReferencesElectricalSection';
import { ReferencesIndustriesSection } from '@/src/features/references/components/ReferencesIndustriesSection/ReferencesIndustriesSection';

export default function ReferencesPage() {
  return (
    <main>
      <ReferencesHero />
      <ReferencesServiceSection />
      <ReferencesKepcoSection />
      <ReferencesElectricalSection />
      <ReferencesIndustriesSection />
    </main>
  );
}
