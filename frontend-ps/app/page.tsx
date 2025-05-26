import { CtaSection } from "@/components/cta-section";
import { FAQs } from "@/components/faqs";
import { FeaturesSection } from "@/components/features-section";
import { GridPattern } from "@/components/grid-pattern";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { MarketsSection } from "@/components/markets-section";
import { cn } from "@/lib/utils";

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
