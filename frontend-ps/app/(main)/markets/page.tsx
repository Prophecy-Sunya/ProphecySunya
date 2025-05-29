"use client";

import { markets } from "@/app/mockdata";
import CategoryFilter from "@/components/main/category-filter";
import MarketGrid from "@/components/main/market-grid";
import { useState } from "react";

export default function MarketsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredMarkets =
    activeCategory === "all"
      ? markets
      : markets.filter((market) => market.category === activeCategory);
  return (
    // <div>
    //   <div className="flex items-center justify-between mb-10">
    //     <h1 className={title()}>All Predictions</h1>
    //     <CreatePredictionButton />
    //   </div>
    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
    //     {predictions.map((prediction) => (
    //       <PredictionCard
    //         key={prediction.id}
    //         category={prediction.category}
    //         content={prediction.content}
    //         creator={prediction.creator}
    //         expirationTime={prediction.expirationTime}
    //         verificationStatus={prediction.verificationStatus}
    //         id={prediction.id}
    //       />
    //     ))}
    //   </div>
    // </div>
    <div>
      <div className="mb-6">
        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </div>
      <MarketGrid markets={filteredMarkets} />
    </div>
  );
}
