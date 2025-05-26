import { predictions } from "@/app/mockdata";
import CreatePredictionButton from "@/components/create-prediction-button";
import PredictionCard from "@/components/prediction-card";
import { title } from "@/components/primitives";

export default function MarketsPage() {
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
