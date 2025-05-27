"use client";

import {
  ArrowTrendingUpIcon,
  ClockIcon,
  StarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { useState } from "react";

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

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="bg-default/5 backdrop-blur-md  border border-default/50 hover:border-default/80 transition-all duration-300 hover:scale-105">
        <CardBody className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Chip size="sm" className="bg-yellow-500/20">
                {market.category}
              </Chip>
              {market.isNew && (
                <Chip size="sm" className="bg-orange-500/20 text-warning">
                  NEW
                </Chip>
              )}
              {market.isMulti && (
                <Chip size="sm" className="bg-blue-500/20 text-primary">
                  MULTI
                </Chip>
              )}
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-default-400 hover:text-danger-400"
            >
              <StarIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Title */}
          <h3 className=" font-semibold text-lg mb-2 leading-tight">
            {market.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground  text-sm mb-4">
            {market.description}
          </p>

          {/* Odds Display */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-default-400">Chance</span>
              <div className="flex gap-4">
                <span className="text-success-400 font-medium">
                  {market.yesChance}%
                </span>
                <span className="text-danger-400 font-medium">
                  {market.noChance}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-default-600/10 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-warning-500 to-warning-400 h-2 rounded-full"
                style={{ width: `${market.yesChance}%` }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs  mb-4">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              <span>{market.timeLeft}</span>
            </div>
            <div className="flex items-center gap-1">
              <UsersIcon className="w-3 h-3" />
              <span>{market.traders} traders</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-3 h-3" />
              <span className="text-warning-500">{market.volume}</span>
            </div>
          </div>
        </CardBody>

        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex gap-2 w-full">
            <Button
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700"
              size="sm"
            >
              Buy Yes
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700"
              size="sm"
            >
              Buy No
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
