"use client";

import {
  ArrowTrendingUpIcon,
  BoltIcon,
  ChevronRightIcon,
  RocketLaunchIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { GridPattern } from "./grid-pattern";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const headlines = [
    "Predict the Future of Markets",
    "Invest in Your Knowledge",
    "Trade Smarter with Sunya",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative pt-24  pb-16 md:pt-32 md:pb-24 flex size-full flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background -z-10" /> */}

      {/* Animated background elements */}
      {/* <div className="absolute top-0 left-0 right-0 h-[500px] -z-20 bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4wNSIgZD0iTTk5IDJsMSAxdjE5NmwtMSAxeiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjA1IiBkPSJNMiA5OWgxOTZ2MUgyeiIvPjwvZz48L3N2Zz4=')]" />
        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-chart-1/10 rounded-full filter blur-[120px] animate-pulse" />
        <div
          className="absolute top-[25%] left-[5%] w-72 h-72 bg-chart-2/10 rounded-full filter blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div> */}

      <GridPattern
        // squares={[
        //   [4, 4],
        //   [5, 1],
        //   [8, 2],
        //   [5, 3],
        //   [5, 5],
        //   [10, 10],
        //   [12, 15],
        //   [15, 10],
        //   [10, 15],
        //   [15, 10],
        //   [10, 15],
        //   [15, 10],
        // ]}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />

      {/* <Container className="relative"> */}
      <div className="relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-muted/80 px-3 py-1 text-sm font-medium mb-6 animate-fade-in">
            <span className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded-full mr-2">
              New
            </span>
            <span className="text-sm">
              Jimpsons ✦ Sunya Integration is live
            </span>
            <ChevronRightIcon className="h-3 w-3 ml-1" />
          </div>

          <h1 className="animate-fade-in min-h-[140px] flex flex-col items-center justify-center text-center text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 ">
            <span className="relative inline-block">
              <span
                className="absolute inset-0 flex items-center justify-center opacity-0 animate-fade-out "
                style={{
                  animationDelay: `${currentIndex * 3500}ms`,

                  background: "linear-gradient(to right, #f472b6, #fbbf24)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {headlines[currentIndex]}
              </span>
              <span
                className="relative inline-block animate-fade-in "
                style={{
                  animationDelay: `${currentIndex * 3500}ms`,

                  background: "linear-gradient(to right, #f472b6, #fbbf24)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {headlines[currentIndex]}
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The first decentralized prediction market combining Jimpsons'
            security with Sunya's innovative trading technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" color="primary">
              <RocketLaunchIcon className="mr-2 h-4 w-4 group-hover:animate-bounce" />
              Start Trading{" "}
            </Button>
            <Button variant="bordered" size="lg">
              Learn More
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Markets", value: "200+", icon: ArrowTrendingUpIcon },
              { label: "Daily Volume", value: "$1.2M", icon: SparklesIcon },
              { label: "Users", value: "50K+", icon: BoltIcon },
              { label: "Success Rate", value: "98%", icon: ChevronRightIcon },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg hover:bg-default-50/80 hover:backdrop-blur-sm  transition-colors duration-300 ease-in-out"
              >
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* </Container> */}
    </div>
  );
}
