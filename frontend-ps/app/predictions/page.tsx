import { title } from "@/components/primitives";
import { predictions } from "../mockdata";
import PredictionCard from "@/components/prediction-card";

export default function PredictionsPage() {
  return (
    <div>
      <h1 className={title()}>All Predictions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-20">
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
