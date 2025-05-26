// components/ConnectStarknetWallet.tsx
"use client";

import { FC, useEffect, useState, useCallback } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  addToast,
} from "@heroui/react";
import {
  useConnect,
  useAccount,
  useDisconnect,
  useNetwork,
  Connector,
} from "@starknet-react/core";
import { useStoreWallet } from "@/stores/wallet-store"; // Ensure this path is correct
import { shortString } from "starknet";

// Helper function to safely decode short strings
const getDecodedChainName = (name: string | undefined): string => {
  if (!name) return "Unknown";
  if (name.startsWith("0x")) {
    try {
      return shortString.decodeShortString(name);
    } catch (e) {
      console.warn("Could not decode chain name as short string:", name, e);
      return name;
    }
  }
  return name;
};

const ConnectStarknetWallet: FC = () => {
  const { connect, connectors, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    account,
    address,
    status, // This is 'disconnected', 'connecting', 'connected', 'reconnecting', 'idle'
    connector: activeStarknetReactConnector,
  } = useAccount();
  const { chain } = useNetwork();

  // Zustand store interactions (syncing from starknet-react)
  const setConnected = useStoreWallet((state) => state.setConnected);
  const setAddressAccount = useStoreWallet((state) => state.setAddressAccount);
  const setAccount = useStoreWallet((state) => state.setAccount);
  const setChain = useStoreWallet((state) => state.setChain);
  const setActiveConnector = useStoreWallet(
    (state) => state.setActiveConnector,
  );
  const resetWalletState = useStoreWallet((state) => state.resetWalletState);
  // We'll primarily rely on starknet-react's status for persistence,
  // so 'lastConnectedConnectorId' in Zustand becomes less critical for reconnection
  // but can be kept for internal state mirroring if desired.
  const setLastConnectedConnectorId = useStoreWallet(
    (state) => state.setLastConnectedConnectorId,
  );

  const [isManualConnecting, setIsManualConnecting] = useState<boolean>(false); // Track manual connect only
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Sync starknet-react state with Zustand store
  useEffect(() => {
    setConnected(status === "connected");
    setAddressAccount(address || "");
    setAccount(account || undefined);
    setChain(getDecodedChainName(chain?.name));
    setActiveConnector(activeStarknetReactConnector || undefined);

    // This is the CRITICAL part:
    if (status === "connected" && activeStarknetReactConnector) {
      // Only set lastConnectedConnectorId when a connection is actively established
      setLastConnectedConnectorId(activeStarknetReactConnector.id);
      setConnectionError(null); // Clear any previous error on successful connect
    }
    // IMPORTANT: Do NOT clear lastConnectedConnectorId if status is "disconnected" or "idle" here.
    // starknet-react will briefly be in these states on reload before autoConnect kicks in.

    // Clear connection error when status is no longer 'connecting' or a clear error state
    if (status === "connected" || status === "reconnecting") {
      setConnectionError(null);
    }
  }, [
    status,
    address,
    account,
    chain,
    activeStarknetReactConnector,
    setConnected,
    setAddressAccount,
    setAccount,
    setChain,
    setActiveConnector,
    setLastConnectedConnectorId,
    setConnectionError,
  ]);

  const handleConnect = useCallback(
    async (connector: Connector) => {
      setIsManualConnecting(true); // Set for manual connection attempt
      setConnectionError(null);
      try {
        await connect({ connector });
        // The useEffect above will handle updating Zustand state and the persisted ID
      } catch (error: any) {
        console.error("Connection failed:", error);
        setConnectionError(
          error.message ||
            "Failed to connect wallet. Please ensure your wallet is unlocked.",
        );
      } finally {
        setIsManualConnecting(false); // Reset after manual connection attempt
      }
    },
    [connect],
  ); // Memoize handleConnect

  const handleDisconnect = useCallback(async () => {
    setConnectionError(null);
    try {
      await disconnect();
      resetWalletState(); // Reset Zustand state on disconnect
      // Optionally clear the last connected connector ID in Zustand
      setLastConnectedConnectorId(undefined); // Clear on disconnect
      // Note: This is not strictly necessary as the useEffect above will handle it
      // but it can be useful if you want to ensure the state is reset immediately.
      // The lastConnectedConnectorId in Zustand is cleared on disconnect
      // to prevent stale data in case of manual reconnect attempts.
      // This is especially useful if the user switches wallets or networks.
      // The useEffect above will handle updating Zustand state and clearing the persisted ID
    } catch (error: any) {
      console.error("Disconnection failed:", error);
      setConnectionError(error.message || "Failed to disconnect wallet.");
    }
  }, [disconnect]); // Memoize handleDisconnect

  // Determine overall loading/connecting state
  const isCurrentlyConnecting =
    isManualConnecting || status === "connecting" || status === "reconnecting";

  // If the status is 'idle' or 'disconnected' but the component is not manually connecting,
  // and we have no connectors, show the prompt to install.
  // If status is 'connecting' or 'reconnecting', we are in the process of restoring.
  // If status is 'connected', we show the connected state.

  if (status === "connected") {
    return (
      <Button
        onPress={handleDisconnect}
        className="bg-gradient-to-tr from-pink-500 to-yellow-500 w-full shadow-lg transition-transform duration-200 ease-in-out hover:scale-105"
        radius="full"
        size="md"
        isLoading={isManualConnecting}
      >
        Disconnect Wallet
      </Button>
    );
  }

  // Render connect UI for 'disconnected', 'idle', 'connecting', 'reconnecting'
  return (
    <div className="flex flex-col items-center p-4">
      {connectionError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-md"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{connectionError}</span>
        </div>
      )}

      <Popover placement="bottom">
        <PopoverTrigger>
          <Button
            className="bg-gradient-to-tr from-pink-500 to-yellow-500 shadow-lg transition-transform duration-200 ease-in-out hover:scale-105"
            radius="full"
            size="lg"
            isLoading={isCurrentlyConnecting}
            isDisabled={connectors.length === 0 && !isCurrentlyConnecting}
          >
            {isCurrentlyConnecting ? (
              <>
                <Spinner size="sm" color="white" className="mr-2" />{" "}
                {status === "reconnecting"
                  ? "Reconnecting..."
                  : "Connecting..."}
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Card className="max-w-[300px] p-4">
            <CardBody className="py-2">
              {connectors.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {connectors.map((connector) => (
                    <Button
                      key={connector.id}
                      variant="ghost"
                      onPress={() => {
                        handleConnect(connector);
                        addToast({
                          title: "Wallet Connected Successfully",
                          description: `Connected to ${connector.name} wallet.`,
                          color: "success",
                        });
                      }}
                      isDisabled={
                        !connector.available() ||
                        isCurrentlyConnecting ||
                        pendingConnector?.id === connector.id
                      }
                      className="justify-start"
                      startContent={
                        pendingConnector?.id === connector.id ? (
                          <Spinner size="sm" />
                        ) : null
                      }
                    >
                      Connect with {connector.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-small text-danger text-center">
                  No Starknet wallet extensions found.
                </p>
              )}
            </CardBody>
            <Divider className="my-2" />
            <CardFooter className="flex flex-col items-center text-small text-gray-500 mt-2">
              Don't have a wallet?
              <div className="flex gap-4 mt-2">
                <a
                  href="https://www.argent.xyz/argent-x/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Argent X
                </a>
                <a
                  href="https://braavos.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Braavos
                </a>
              </div>
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>

      {connectors.length === 0 && !isCurrentlyConnecting && (
        <p className="text-red-500 mt-4 text-center">
          Please install a Starknet wallet extension like Argent X or Braavos.
        </p>
      )}
    </div>
  );
};

export default ConnectStarknetWallet;
