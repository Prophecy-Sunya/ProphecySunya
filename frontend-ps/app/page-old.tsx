"use client";

import { features, predictions } from "./mockdata";

import PredictionCard from "@/components/prediction-card";
import HowItWorksCard from "@/components/how-it-works-card";
import { subtitle, title } from "@/components/primitives";
import { FAQs } from "@/components/faqs";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({ color: "yellow" })}>Prophecy Sunya&nbsp;</span>
        <br />
        <div className={subtitle({ class: "mt-4" })}>
          Decentralized Prediction Markets on Starknet.
        </div>
      </div>

      {/* How It Works */}
      <div className="inline-block text-center justify-center">
        <span className={title({ color: "yellow", size: "sm" })}>
          How It Works&nbsp;
        </span>
        <span className={subtitle({ class: "mt-2" })}>
          Prophet is a decentralized prediction market platform that allows
          users to create, trade, and verify predictions on various events.
          Here's how it works:
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {features.map((feature) => (
          <HowItWorksCard
            key={feature.id}
            name={feature.name}
            description={feature.description}
            Icon={feature.Icon}
          />
        ))}
      </div>

      {/* Latest Predictions */}

      <div className="inline-block text-center justify-center">
        <span className={title({ color: "yellow", size: "sm" })}>
          Latest Predictions
        </span>
        <span className={subtitle({ class: "mt-2" })}>
          Explore the latest predictions made by our community. Join the
          conversation and make your own predictions!
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {predictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            category={prediction.category}
            content={prediction.content}
            creator={prediction.creator}
            expirationTime={prediction.expirationTime}
            verificationStatus={prediction.verificationStatus}
            id={prediction.id}
          />
        ))}
      </div>

      {/* faqs  */}
      <div className="inline-block text-center justify-center">
        <span className={title({ color: "yellow", size: "sm" })}>
          Frequently Asked Questions
        </span>
        <span className={subtitle({ class: "mt-2" })}>
          Have questions? We have answers! Explore our FAQs to learn more about
          how Prophet works, how to create predictions, and more.
        </span>
      </div>
      <div className="w-full mb-20">
        <FAQs />
      </div>
    </section>
  );
}
