// This file contains utility functions for various purposes.
// It includes functions for formatting numbers, truncating addresses, and more.

import { formatDistance } from 'date-fns';

// Function to format a wallet address for display purposes.
export const truncateAddress = (address: string) =>
  `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

export const timeUntilExpiration = (expirationTime: number) =>
  formatDistance(new Date(expirationTime), new Date(), { addSuffix: true });
