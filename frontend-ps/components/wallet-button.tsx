// components/wallet-button.tsx
"use client"; // This component must be a client component

import { Button } from "@heroui/button"; // Assuming @heroui/button is your NextUI Button alias
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { shortString } from "starknet";
import { Chip } from "@heroui/react"; // For connected status chip
import { useStoreWallet } from "@/stores/wallet-store";
import ConnectStarknetWallet from "./connect-starknet-wallet-button";

const WalletButton = () => {
  const isConnected = useStoreWallet((state) => state.isConnected);
  const address = useStoreWallet((state) => state.address);
  const activeConnector = useStoreWallet((state) => state.activeConnector);
  const chain = useStoreWallet((state) => state.chain); // Assuming chain is now a string

  return (
    <Popover placement="bottom" showArrow offset={10}>
      <PopoverTrigger>
        <Button
          className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
          radius="full"
          variant="shadow" // Use a variant that works well with gradients
        >
          {isConnected ? (
            <div className="flex items-center gap-2">
              <Chip size="sm" color="success" variant="flat">
                Connected
              </Chip>
              {address && `${address.slice(0, 4)}...${address.slice(-4)}`}
            </div>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        {/* The ConnectStarknetWallet component handles its own UI and logic */}
        <ConnectStarknetWallet />
      </PopoverContent>
    </Popover>
  );
};

export default WalletButton;
