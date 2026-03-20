// app/[locale]/page.tsx

import { HomeAiReportSection } from '@/src/features/home/components/HomeAiReportSection/HomeAiReportSection';
import { HomeApprovalSection } from '@/src/features/home/components/HomeApprovalSection/HomeApprovalSection';
import { HomeCctvSection } from '@/src/features/home/components/HomeCctvSection/HomeCctvSection';
import { HomeEmployeeSection } from '@/src/features/home/components/HomeEmployeeSection/HomeEmployeeSection';
import { HomeDashboardSection } from '@/src/features/home/components/HomeDashboardSection/HomeDashboardSection';
import { HomeFeatureSection } from '@/src/features/home/components/HomeFeatureSection/HomeFeatureSection';
import { HomeHero } from '@/src/features/home/components/HomeHero/HomeHero';
import { HomeMessengerSection } from '@/src/features/home/components/HomeMessengerSection/HomeMessengerSection';
import { HomeNewsSection } from '@/src/features/home/components/HomeNewsSection/HomeNewsSection';
import { HomeProductSection } from '@/src/features/home/components/HomeProductSection/HomeProductSection';
import { HomeProjectSection } from '@/src/features/home/components/HomeProjectSection/HomeProjectSection';
import { HomeUploadSection } from '@/src/features/home/components/HomeUploadSection/HomeUploadSection';

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeNewsSection />
      <HomeFeatureSection />
      <HomeProductSection />
      <HomeProjectSection />
      <HomeUploadSection />
      <HomeMessengerSection />
      <HomeDashboardSection />
      <HomeApprovalSection />
      <HomeEmployeeSection />
      <HomeAiReportSection />
    </main>
  );
}
