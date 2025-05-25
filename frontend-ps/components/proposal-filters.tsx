"use client";

import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Chip } from "@heroui/react";
import { useState } from "react";

export function ProposalFilters() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statuses = [
    { key: "all", label: "All Proposals" },
    { key: "active", label: "Active" },
    { key: "passed", label: "Passed" },
    { key: "failed", label: "Failed" },
    { key: "pending", label: "Pending" },
  ];

  const getStatusLabel = () =>
    statuses.find((s) => s.key === selectedStatus)?.label || "All Proposals";

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Input
            placeholder="Search proposals..."
            startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
            className="w-full sm:w-80"
            classNames={{
              input: "placeholder:text-default-500",
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
          {/* Status Dropdown */}
          <div className="relative">
            <Button
              variant="bordered"
              endContent={<ChevronDownIcon className="w-4 h-4" />}
              className="border-default/50 hover:bg-default/10 w-40 justify-between"
              onPress={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              {getStatusLabel()}
            </Button>
            {showStatusDropdown && (
              <div className="absolute top-full mt-2 w-full  border border-default/40 rounded-lg shadow-lg z-10">
                {statuses.map((status) => (
                  <button
                    key={status.key}
                    className="w-full px-4 py-2 text-left  hover:bg-default/80 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSelectedStatus(status.key);
                      setShowStatusDropdown(false);
                    }}
                  >
                    {status.label}
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
          Active Voting
        </Chip>
        <Chip
          variant="flat"
          className="bg-secondary/20 text-secondary border-secondary/30"
        >
          High Participation
        </Chip>
        <Chip
          variant="flat"
          className="bg-success/20 text-success border-success/30"
        >
          Core Protocol
        </Chip>
        <Chip
          variant="flat"
          className="bg-warning/20 text-warning border-warning/30"
        >
          Ending Soon
        </Chip>
      </div>
    </div>
  );
}
