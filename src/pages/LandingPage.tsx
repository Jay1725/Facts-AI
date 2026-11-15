import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CapabilitiesSection from '@/components/landing/CapabilitiesSection';
import VerdictLegendSection from '@/components/landing/VerdictLegendSection';
import FinalCtaSection from '@/components/landing/FinalCtaSection';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <CapabilitiesSection />
      <VerdictLegendSection />
      <FinalCtaSection />
    </>
  );
}
