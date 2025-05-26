import { title } from "@/components/primitives";
import { predictions } from "../mockdata";
import PredictionCard from "@/components/prediction-card";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import CreatePredictionButton from "@/components/create-prediction-button";

export default function PredictionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className={title()}>All Predictions</h1>
        <CreatePredictionButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
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
    </div>
  );
}
