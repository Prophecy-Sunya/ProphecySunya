"use client";

import {
  ArrowUpRightIcon,
  ChartBarIcon,
  LightBulbIcon,
  LockClosedIcon,
  PresentationChartLineIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { Chip } from "@heroui/react";
import { Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";

// import { Container } from "@/components/ui/container";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   ShieldCheck,
//   LineChart,
//   BarChart,
//   ArrowUpRight,
//   Lightbulb,
//   Rocket,
//   Lock,
//   Wallet,
// } from "lucide-react";

export function FeaturesSection() {
  let tabs = [
    {
      id: "prediction",
      label: "Prediction Markets",
      contents: [
        {
          title: "Real-Time Markets",
          description:
            "Create and trade in markets with instant settlement and real-time data feeds.",
          icon: PresentationChartLineIcon,
        },
        {
          title: "Custom Predictions",
          description:
            "Build your own prediction markets on any verifiable future event.",
          icon: LightBulbIcon,
        },
        {
          title: "Advanced Analytics",
          description:
            "Get deep insights into market trends and user behavior patterns.",
          icon: ChartBarIcon,
        },
        {
          title: "Low Fees",
          description:
            "Enjoy some of the lowest fees in the prediction market space.",
          icon: WalletIcon,
        },
        {
          title: "Liquidity Pools",
          description:
            "Access deep liquidity pools for seamless trading experiences.",
          icon: ArrowUpRightIcon,
        },
        {
          title: "Reward System",
          description:
            "Earn rewards for accurate predictions and market making.",
          icon: RocketLaunchIcon,
        },
      ],
    },
    {
      id: "technology",
      label: "Technology",
      contents: [
        {
          title: "Sunya Protocol",
          description:
            "Built on Sunya's cutting-edge trading protocol for maximum efficiency and transparency.",
          icon: RocketLaunchIcon,
        },
        {
          title: "Jimpsons Security",
          description:
            "Industry-leading security measures to protect user assets and data.",
          icon: ShieldCheckIcon,
        },
        {
          title: "Zero-Knowledge Proofs",
          description:
            "Private trading with cryptographic proof of correctness without revealing data.",
          icon: LockClosedIcon,
        },
        {
          title: "Cross-Chain Integration",
          description:
            "Operate seamlessly across multiple blockchain networks with unified liquidity.",
          icon: ArrowUpRightIcon,
        },
        {
          title: "AI-Powered Insights",
          description:
            "Access intelligent market insights and prediction assistance tools.",
          icon: LightBulbIcon,
        },
        {
          title: "Non-Custodial Wallets",
          description:
            "Retain full control of your assets with non-custodial wallet integration.",
          icon: WalletIcon,
        },
      ],
    },
  ];
  return (
    <section id="features" className="py-16 md:py-24 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-chart-1/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 left-0 w-1/2 h-1/2 bg-chart-3/5 rounded-full blur-[150px]" />
      </div>

      {/* <Container> */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Chip variant="bordered" className="mb-4">
          <div className="flex items-center font-semibold">
            <span className="mr-1">✦</span>
            <span>Features</span>
          </div>
        </Chip>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          The Best of Both Worlds
        </h2>
        <p className="text-muted-foreground text-lg">
          Combining Jimpsons' robust security framework with Sunya's innovative
          prediction markets for a seamless trading experience.
        </p>
      </div>

      <Tabs
        items={tabs}
        aria-label="Platform Features Tabs"
        fullWidth
        classNames={{
          base: "w-1/2 flex justify-center  mx-auto",
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {item.contents.map((item, index) => (
                <div
                  key={index}
                  className="bg-transparent rounded-xl p-6 backdrop-blur-sm h-full flex flex-col items-center text-center relative border border-default/50 z-10"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground flex-grow">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Tab>
        )}
      </Tabs>
      {/* </Container> */}
    </section>
  );
}
