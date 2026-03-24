// app/[locale]/about-us/page.tsx

import { AboutHero } from "@/src/features/about/components/AboutHero/AboutHero";
import { AboutTeam } from "@/src/features/about/components/AboutTeam/AboutTeam";
import { AboutOffice } from "@/src/features/about/components/AboutOffice/AboutOffice";

export default function AboutUsPage() {
  return (
    <main>
      <AboutHero />
      <AboutTeam />
      <AboutOffice />
    </main>
  );
}
