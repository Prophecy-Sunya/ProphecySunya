import {
  ArrowRightIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  CheckIcon,
  CircleStackIcon,
  PresentationChartLineIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      {/* <Container> */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Chip variant="bordered" className="mb-4">
          <div className="flex items-center font-semibold">
            <CheckIcon className="mr-1 h-3 w-3" />
            <span>Simple Process</span>
          </div>
        </Chip>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          How SunyaPredict Works
        </h2>
        <p className="text-muted-foreground text-lg">
          Our platform combines Jimpsons' security with Sunya's innovative
          prediction market technology for a seamless trading experience.
        </p>
      </div>

      <div className="relative">
        {/* Desktop connector line (hidden on mobile) */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border hidden md:block" />

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {[
            {
              title: "Connect Wallet",
              description:
                "Securely connect your wallet to access the platform's features.",
              icon: WalletIcon,
            },
            {
              title: "Explore Markets",
              description:
                "Browse through various prediction markets across categories.",
              icon: ChartBarIcon,
            },
            {
              title: "Place Predictions",
              description:
                "Take positions based on your market insights and analysis.",
              icon: PresentationChartLineIcon,
            },
            {
              title: "Verify Predictions",
              description:
                "Predictions are verified through AI oracles and community governance.",
              icon: CheckBadgeIcon,
            },
            {
              title: "Mint NFTs",
              description:
                "Verified predictions can be minted as NFTs with prophet scores.",
              icon: CircleStackIcon,
            },
            {
              title: "Collect Rewards",
              description: "Earn rewards when your predictions are correct.",
              icon: CheckIcon,
            },
          ].map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-transparent rounded-xl p-6 backdrop-blur-sm h-full flex flex-col items-center text-center relative border border-default/50 z-10">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>

                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mt-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {/* Arrow connector (visible only on desktop) */}
              {index < 5 && (
                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 hidden md:block z-20">
                  <ArrowRightIcon className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* </Container> */}
    </section>
  );
}
