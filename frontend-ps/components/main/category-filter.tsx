"use client";

import {
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  CircleStackIcon,
  ClockIcon,
  FaceFrownIcon,
  FireIcon,
  FlagIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { Button, Input } from "@heroui/react";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function CategoryFilter({
  activeCategory,
  setActiveCategory,
}: CategoryFilterProps) {
  const categories = [
    { id: "all", name: "All", icon: <FireIcon className="size-4" /> },
    {
      id: "memecoin",
      name: "Memecoin",
      icon: <FaceFrownIcon className="size-4" />,
    },
    {
      id: "crypto",
      name: "Crypto",
      icon: <CircleStackIcon className="size-4" />,
    },
    { id: "volume", name: "Volume", icon: <ChartBarIcon className="size-4" /> },
    { id: "sports", name: "Sports", icon: <TrophyIcon className="size-4" /> },
    { id: "politics", name: "Politics", icon: <FlagIcon className="size-4" /> },
    { id: "other", name: "Other", icon: <ClockIcon className="size-4" /> },
  ];

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "solid" : "bordered"}
            className={`
              flex items-center gap-2 border border-default/50
              ${
                activeCategory === category.id
                  ? "bg-default-300  hover:bg-default-500"
                  : "bg-transparent  hover:bg-default-500 "
              }
            `}
            startContent={category.icon}
            onPress={() => setActiveCategory(category.id)}
            size="sm"
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full items-center justify-between">
        <Input
          placeholder="Search markets..."
          startContent={<MagnifyingGlassIcon className="w-4 h-4 " />}
          className="w-full sm:w-5/6"
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
    </>
  );
}
