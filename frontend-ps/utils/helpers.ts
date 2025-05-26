// This file contains utility functions for various purposes.
// It includes functions for formatting numbers, truncating addresses, and more.

import { formatDistance } from "date-fns";

// Function to format a wallet address for display purposes.
export const truncateAddress = (address: string) =>
  `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

export const timeUntilExpiration = (expirationTime: number) =>
  formatDistance(new Date(expirationTime), new Date(), { addSuffix: true });

export function formatCurrency(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1
        ? `${interval} ${unit} ago`
        : `${interval} ${unit}s ago`;
    }
  }

  return "just now";
}
