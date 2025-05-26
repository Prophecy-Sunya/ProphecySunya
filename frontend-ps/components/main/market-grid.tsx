"use client";

import MarketCard from "@/components/main/market-card";

interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  yesChance: number;
  noChance: number;
  volume: string;
  timeLeft: string;
  traders: number;
  isNew: boolean;
  isMulti: boolean;
}

interface MarketGridProps {
  markets: Market[];
}

export default function MarketGrid({ markets }: MarketGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  );
}
