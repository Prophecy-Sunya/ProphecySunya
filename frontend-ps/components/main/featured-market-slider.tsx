"use client";

import {
  ArrowTrendingUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import Image from "next/image";

export function FeaturedMarket() {
  return (
    <Card className="bg-gradient-to-r from-pink-500  to-yellow-700 border-none overflow-hidden">
      <CardBody className="p-0">
        <div className="relative flex items-center justify-between p-8">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
              <Chip className="bg-white/20 text-white text-sm">
                🚀 BREAKING BET
              </Chip>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              WILL BITCOIN REACH
              <br />
              <span className="text-yellow-200">$100,000 BY 2024?</span>
            </h2>

            <div className="flex items-center gap-4 mb-6">
              <Button
                size="lg"
                className="bg-white text-orange-600 font-semibold px-8 hover:bg-gray-100"
              >
                Trade Now
              </Button>
              <div className="flex items-center gap-2 text-white">
                <ClockIcon className="w-4 h-4" />
                <span className="font-medium">2d 14h 38m remaining</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white/80">
              <div>
                <div className="text-sm">Total Volume</div>
                <div className="text-xl font-bold">$2.4M</div>
              </div>
              <div>
                <div className="text-sm">Traders</div>
                <div className="text-xl font-bold">1,247</div>
              </div>
            </div>
          </div>

          {/* Right Content - Character */}
          <div className="hidden lg:block relative">
            <div className="w-80 h-80 relative">
              <Image
                src="/placeholder.svg?height=320&width=320"
                alt="Bitcoin Prophecy Character"
                width={320}
                height={320}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            isIconOnly
            variant="bordered"
            className="absolute left-4 top-1/2 -translate-y-1/2 border-white/30 text-white hover:bg-white/10"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>
          <Button
            isIconOnly
            variant="bordered"
            className="absolute right-4 top-1/2 -translate-y-1/2 border-white/30 text-white hover:bg-white/10"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
export default FeaturedMarket;
