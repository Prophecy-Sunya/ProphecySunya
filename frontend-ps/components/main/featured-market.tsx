"use client";

import { featuredMarkets } from "@/app/mockdata";
import {
  ArrowTrendingUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Card, CardBody, Button, Chip, Image } from "@heroui/react";
import NextImage from "next/image";
import { useEffect, useState } from "react";

export function FeaturedMarket() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev === featuredMarkets.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? featuredMarkets.length - 1 : prev - 1,
    );
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentMarket = featuredMarkets[activeIndex];

  return (
    <div className="relative w-full h-[420px] overflow-hidden rounded-lg">
      <Card className="border-none overflow-hidden h-full" shadow="sm">
        <CardBody className="p-0 overflow-hidden relative">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {featuredMarkets.map((market, index) => (
              <div
                key={market.id}
                className="min-w-full h-full relative flex items-center"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={market.imageUrl || "/placeholder-image.jpg"}
                    alt={market.title}
                    className="object-cover"
                  />
                </div>

                {/* Gradient Overlay - Left to Right */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

                {/* Additional warm gradient overlay for theme consistency */}
                <div className="absolute inset-0 z-15 bg-gradient-to-r from-yellow-900/40 via-orange-800/30 to-transparent"></div>

                {/* Content */}
                <div className="relative z-20 flex-1 p-8">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Chip
                        variant="flat"
                        color="primary"
                        size="md"
                        radius="sm"
                        startContent={
                          <ArrowTrendingUpIcon className="w-5 h-5 text-white/80" />
                        }
                      >
                        <span className="font-semibold text-white/90">
                          {market.category}
                        </span>
                      </Chip>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-white/90 mb-6 leading-tight drop-shadow-lg">
                      {market.title}
                    </h2>

                    <p className="text-lg text-white/90 mb-6 drop-shadow-md">
                      {market.title}
                    </p>

                    <div className="flex items-center gap-4 mb-6">
                      <Button
                        size="md"
                        className="bg-gradient-to-r from-pink-500 to-yellow-500  font-semibold px-8 hover:from-pink-600 hover:to-yellow-600 transition-all duration-300 text-white/80"
                      >
                        Trade Now
                      </Button>
                      <div className="flex items-center gap-2 text-white/80 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                        <ClockIcon className="w-4 h-4" />
                        <span className="font-medium">
                          {market.timeRemaining} remaining
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>

        {/* Navigation dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
          {featuredMarkets.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-white w-6 shadow-lg"
                  : "bg-white/50 w-2 hover:bg-white/70"
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <Button
          isIconOnly
          variant="bordered"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 border-white/30 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm shadow-lg"
          onPress={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>

        <Button
          isIconOnly
          variant="bordered"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 border-white/30 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm shadow-lg"
          onPress={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </Card>
    </div>
  );
}

export default FeaturedMarket;
