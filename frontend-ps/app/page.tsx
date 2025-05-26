import { CtaSection } from "@/components/landing/cta-section";
import { FAQs } from "@/components/landing/faqs";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MarketsSection } from "@/components/landing/markets-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <MarketsSection />
      <HowItWorks />
      <FeaturesSection />
      <FAQs />
      <CtaSection />
    </main>
  );
}
