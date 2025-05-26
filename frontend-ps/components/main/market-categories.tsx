"use client";

import {
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button, Input } from "@heroui/react";
import { useState } from "react";

export function MarketCategories() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { key: "all", label: "All", icon: "🔥" },
    { key: "crypto", label: "Crypto", icon: "₿" },
    { key: "sports", label: "Sports", icon: "⚽" },
    { key: "politics", label: "Politics", icon: "🗳️" },
    { key: "entertainment", label: "Entertainment", icon: "🎬" },
    { key: "technology", label: "Technology", icon: "💻" },
    { key: "other", label: "Other", icon: "🌟" },
  ];

  return (
    <div className="space-y-6">
      {/* Browse by Category Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Browse by Category
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "solid" : "bordered"}
              className={`
                ${
                  selectedCategory === category.key
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "border-yellow-400/20 text-white hover:bg-yellow-400/10"
                }
              `}
              startContent={<span>{category.icon}</span>}
              onPress={() => setSelectedCategory(category.key)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 w-full sm:w-auto">
          <Input
            placeholder="Search markets..."
            startContent={
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
            }
            className="w-full sm:w-80"
            classNames={{
              input: "bg-white/10 text-white placeholder:text-gray-300",
              inputWrapper:
                "bg-white/10 border-yellow-400/20 hover:border-yellow-400/40",
            }}
          />
          <Button
            variant="bordered"
            startContent={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
            className="border-yellow-400/20 text-white hover:bg-yellow-400/10"
          >
            Filters
          </Button>
        </div>

        <Button
          variant="bordered"
          startContent={<ArrowTrendingUpIcon className="w-4 h-4" />}
          className="border-yellow-400/20 text-white hover:bg-yellow-400/10"
        >
          Sort by Volume
        </Button>
      </div>
    </div>
  );
}
//     </div>
