"use client";

import MarketCard from "@/components/main/market-card";
import { Pagination } from "@heroui/react";
import { useMemo, useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const marketsPerPage = 3;

  // Calculate pagination values
  const totalPages = Math.ceil(markets.length / marketsPerPage);

  // Get current markets for the page
  const currentMarkets = useMemo(() => {
    const startIndex = (currentPage - 1) * marketsPerPage;
    const endIndex = startIndex + marketsPerPage;
    return markets.slice(startIndex, endIndex);
  }, [markets, currentPage, marketsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when markets change (e.g., when filtering)
  useMemo(() => {
    setCurrentPage(1);
  }, [markets]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {/* Pagination - Only show if there are multiple pages */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            showControls
            loop
            page={currentPage}
            total={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}

      {/* Markets info */}
      <div className="text-center text-sm text-default-500">
        Showing {currentMarkets.length} of {markets.length} markets
        {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
      </div>
    </div>
  );
}
