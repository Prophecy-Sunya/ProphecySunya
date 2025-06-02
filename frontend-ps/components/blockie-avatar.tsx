"use client";

import { blo } from "blo";

interface BlockieAvatarProps {
  address: string;
  ensImage?: string | null;
}

// Custom Avatar for RainbowKit
export const BlockieAvatar = ({ address, ensImage }: BlockieAvatarProps) => (
  // Don't want to use nextJS Image here (and adding remote patterns for the URL)
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className="rounded-full size-full "
    src={ensImage || blo(address as `0x${string}`)}
    alt={`${address} avatar`}
  />
);
