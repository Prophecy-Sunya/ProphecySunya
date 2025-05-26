"use client";

import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowUpRightIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import PredictionCard from "./prediction-card";
import { predictions } from "@/app/mockdata";
// Sample market data
const markets = [
  {
    id: 1,
    title: "Bitcoin above $100K by Dec 2025",
    category: "Crypto",
    volume: "$1.2M",
    probability: 76,
    trending: "up",
    change: "+2.3%",
    liquidity: "$230K",
    hot: true,
  },
  {
    id: 2,
    title: "ETH 2.0 full implementation by Q2",
    category: "Crypto",
    volume: "$845K",
    probability: 62,
    trending: "down",
    change: "-1.5%",
    liquidity: "$180K",
    hot: false,
  },
  {
    id: 3,
    title: "S&P 500 above 6000 in 2025",
    category: "Stocks",
    volume: "$650K",
    probability: 34,
    trending: "up",
    change: "+0.8%",
    liquidity: "$140K",
    hot: false,
  },
  {
    id: 4,
    title: "US Inflation below 2% by Q3",
    category: "Economics",
    volume: "$920K",
    probability: 28,
    trending: "down",
    change: "-3.2%",
    liquidity: "$210K",
    hot: true,
  },
  {
    id: 5,
    title: "Tesla delivers 3M vehicles in 2025",
    category: "Stocks",
    volume: "$780K",
    probability: 45,
    trending: "up",
    change: "+1.1%",
    liquidity: "$190K",
    hot: false,
  },
  {
    id: 6,
    title: "First human mission to Mars by 2028",
    category: "Science",
    volume: "$530K",
    probability: 12,
    trending: "up",
    change: "+0.3%",
    liquidity: "$90K",
    hot: true,
  },
];

const categories = [
  "All",
  "Crypto",
  "Stocks",
  "Economics",
  "Science",
  "Politics",
];

export function MarketsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredMarkets =
    selectedCategory === "All"
      ? markets
      : markets.filter((market) => market.category === selectedCategory);

  return (
    <section id="markets" className="py-16 md:py-24">
      {/* <Container> */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div>
          <Chip variant="bordered" className="mb-4">
            <div className="flex items-center font-semibold">
              <ArrowTrendingUpIcon className="mr-1 h-4 w-4" />
              <span>Popular Markets</span>
            </div>
          </Chip>
          <h2 className="text-3xl md:text-4xl font-bold">
            Top Prediction Markets
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Discover the most active markets with high liquidity and trading
            volume.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "solid" : "bordered"}
              size="sm"
              onPress={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.map((market) => (
          <Link href="#" key={market.id} className="group">
            <Card className="h-full border border-border/50 group-hover:border-primary/30 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Chip variant="bordered">{market.category}</Chip>
                  {market.hot && (
                    <Chip className="bg-chart-1/80 hover:bg-chart-1 flex items-center">
                      <BoltIcon className="mr-1 h-3 w-3" /> Hot
                    </Chip>
                  )}
                </div>
                <CardHeader className="text-xl mt-3 group-hover:text-primary transition-colors line-clamp-2">
                  {market.title}
                </CardHeader>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm text-muted-foreground">Probability</p>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold mr-2">
                        {market.probability}%
                      </span>
                      <span
                        className={`text-sm flex items-center ${
                          market.trending === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {market.trending === "up" ? (
                          <ArrowUpRightIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRightIcon className="h-3 w-3 mr-1" />
                        )}
                        {market.change}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="text-lg font-semibold">{market.volume}</p>
                  </div>
                </div>

                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${market.probability}%` }}
                  />
                </div>
              </CardBody>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {market.liquidity}
                  </span>{" "}
                  liquidity
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                >
                  Trade Now
                  <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
        {/* {predictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            category={prediction.category}
            content={prediction.content}
            creator={prediction.creator}
            expirationTime={prediction.expirationTime}
            verificationStatus={prediction.verificationStatus}
            id={prediction.id}
          />
        ))} */}
      </div>

      <div className="mt-10 text-center">
        <Button variant="bordered" size="lg" className="group">
          View All Markets
          <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
      {/* </Container> */}
    </section>
  );
}
