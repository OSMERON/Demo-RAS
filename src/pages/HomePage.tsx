import { CtaBand } from "../components/CtaBand";
import { HomeHero } from "../components/HomeHero";
import { ProcessSection } from "../components/ProcessSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { ServicesOverview } from "../components/ServicesOverview";
import { TrustBar } from "../components/TrustBar";
import { WhySection } from "../components/WhySection";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustBar />
      <ServicesOverview />
      <ProcessSection />
      <WhySection />
      <ReviewsSection />
      <CtaBand />
    </>
  );
}
