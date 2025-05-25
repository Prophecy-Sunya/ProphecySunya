"use client";

import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Chip } from "@heroui/react";
import { useState } from "react";

export function NFTFilters() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const categories = [
    { key: "all", label: "All Categories" },
    { key: "art", label: "Art" },
    { key: "gaming", label: "Gaming" },
    { key: "music", label: "Music" },
    { key: "photography", label: "Photography" },
    { key: "sports", label: "Sports" },
    { key: "collectibles", label: "Collectibles" },
  ];

  const priceRanges = [
    { key: "all", label: "All Prices" },
    { key: "under-1", label: "Under 1 ETH" },
    { key: "1-5", label: "1-5 ETH" },
    { key: "5-10", label: "5-10 ETH" },
    { key: "over-10", label: "Over 10 ETH" },
  ];

  const getCategoryLabel = () =>
    categories.find((c) => c.key === selectedCategory)?.label ||
    "All Categories";
  const getPriceLabel = () =>
    priceRanges.find((p) => p.key === selectedPriceRange)?.label ||
    "All Prices";

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Input
            placeholder="Search NFTs, collections, or creators..."
            startContent={<MagnifyingGlassIcon className="w-4 h-4 " />}
            className="w-full sm:w-80"
            classNames={{
              input: " placeholder:text-default-500",
              inputWrapper:
                "bg-default/50 border-default/20 hover:border-default/40",
            }}
          />
          <Button
            variant="bordered"
            startContent={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
            className="border-default/40  hover:bg-default/10"
          >
            Filters
          </Button>
        </div>

        <div className="flex gap-4">
          {/* Category Dropdown */}
          <div className="relative">
            <Button
              variant="bordered"
              endContent={<ChevronDownIcon className="w-4 h-4" />}
              className="border-default/50 hover:bg-default/10 w-40 justify-between"
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              {getCategoryLabel()}
            </Button>
            {showCategoryDropdown && (
              <div className="absolute top-full mt-2 w-full border border-default/40 rounded-lg shadow-lg z-10">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    className="w-full px-4 py-2 text-left hover:bg-default/80 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSelectedCategory(category.key);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Dropdown */}
          <div className="relative">
            <Button
              variant="bordered"
              endContent={<ChevronDownIcon className="w-4 h-4" />}
              className="border-default/50 hover:bg-default/10 w-40 justify-between"
              onPress={() => setShowPriceDropdown(!showPriceDropdown)}
            >
              {getPriceLabel()}
            </Button>
            {showPriceDropdown && (
              <div className="absolute top-full mt-2 w-full border border-default/40 rounded-lg shadow-lg z-10">
                {priceRanges.map((range) => (
                  <button
                    key={range.key}
                    className="w-full px-4 py-2 text-left hover:bg-default/80 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSelectedPriceRange(range.key);
                      setShowPriceDropdown(false);
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip
          variant="flat"
          className="bg-primary/20 text-primary border-primary/30"
        >
          Trending
        </Chip>
        <Chip
          variant="flat"
          className="bg-secondary/20 text-secondary border-secondary/30"
        >
          New Drops
        </Chip>
        <Chip
          variant="flat"
          className="bg-success/20 text-success border-success/30"
        >
          Verified
        </Chip>
        <Chip
          variant="flat"
          className="bg-warning/20 text-warning border-warning/30"
        >
          Auction Ending
        </Chip>
      </div>
    </div>
  );
}
