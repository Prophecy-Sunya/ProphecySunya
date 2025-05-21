"use client";

import { features, predictions } from "./mockdata";

import PredictionCard from "@/components/prediction-card";
import HowItWorksCard from "@/components/how-it-works-card";
import { subtitle, title } from "@/components/primitives";

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
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({ color: "foreground", size: "sm" })}>
          How It Works&nbsp;
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

      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({ color: "foreground", size: "sm" })}>
          Latest Predictions
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
    </section>
  );
}
