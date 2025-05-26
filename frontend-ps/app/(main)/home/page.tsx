"use client";

import { hotPredictions, markets, recentActivity } from "@/app/mockdata";
import CategoryFilter from "@/components/main/category-filter";
import FeaturedMarketSlider from "@/components/main/featured-market-slider";
import MarketGrid from "@/components/main/market-grid";
import { getTimeAgo } from "@/utils/helpers";
import {
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useState } from "react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredMarkets =
    activeCategory === "all"
      ? markets
      : markets.filter((market) => market.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-900 to-background-800  ">
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-4">Featured Markets</h1>
              <FeaturedMarketSlider />
            </div>

            <div className="mb-6">
              <CategoryFilter
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>
            <MarketGrid markets={filteredMarkets} />
          </div>

          <div className="w-80 rounded-lg p-6 space-y-6  bg-default/5 backdrop-blur-sm">
            {/* Hot Predictions */}
            <Card className="bg-default/5 backdrop-blur-md border border-default/50">
              <CardBody className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold ">🔥 Hot Ones</h3>
                </div>

                <div className="space-y-3">
                  {hotPredictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="bg-default-600/5 rounded-lg p-3 hover:bg-default-600/10 transition-colors cursor-pointer border border-default-400/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-default-600 leading-tight flex-1">
                          {prediction.title}
                        </h4>
                        {prediction.isNew && (
                          <Chip
                            size="sm"
                            className="bg-primary-500/20  text-xs ml-2"
                          >
                            NEW
                          </Chip>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs  mb-2">
                        <span>{prediction.yesChance}% Chance</span>
                        <span>{prediction.noChance}%</span>
                      </div>

                      <div className="w-full bg-default-600/10 rounded-full h-2 mb-2">
                        <div
                          className="bg-gradient-to-r from-warning-500 to-warning-400 h-2 rounded-full"
                          style={{ width: `${prediction.yesChance}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-default-600 flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {prediction.timeLeft}
                        </span>
                        <span className="text-warning-500 font-medium">
                          {prediction.volume}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Trade All Markets */}
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 font-semibold py-3 hover:from-pink-600 hover:to-yellow-600"
              endContent={<ArrowRightIcon className="w-5 h-5" />}
            >
              📈 Trade All Markets
            </Button>

            {/* Live Activity */}
            <Card className="bg-default/5 backdrop-blur-md border border-default-400/20">
              <CardBody className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <ArrowTrendingUpIcon className="w-5 h-5 text-success" />
                    <h3 className="text-lg font-semibold text-default-600">
                      Activity
                    </h3>
                    <Chip
                      size="sm"
                      className="bg-green-500/20 text-green-300 text-xs"
                    >
                      🟢 LIVE
                    </Chip>
                  </div>
                </div>

                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <UsersIcon className="w-4 h-4 text-default-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-default-600">
                          <span className="font-medium">{activity.user}</span>
                          <span className="text-success mx-1">
                            {activity.actionType}
                          </span>
                          <span>order for </span>
                          <span className="text-success">
                            &nbsp;{activity.action}
                          </span>
                          <span className="font-semibold text-default-600">
                            &nbsp;@{activity.amount}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {activity.market} • {getTimeAgo(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="bordered"
                  size="sm"
                  className="w-full mt-3 border-default-400/20 text-default-600 hover:bg-default-400/10"
                >
                  View All Activity
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
