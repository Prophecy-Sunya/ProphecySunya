// stores/wallet-store.ts
"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProviderInterface, AccountInterface } from "starknet";
import { Connector } from "@starknet-react/core";

export interface WalletState {
  activeConnector: Connector | undefined;
  setActiveConnector: (connector: Connector | undefined) => void;

  address: string;
  setAddressAccount: (address: string) => void;

  chain: string;
  setChain: (chain: string) => void;

  account: AccountInterface | undefined;
  setAccount: (account: AccountInterface | undefined) => void; // Fixed to allow undefined

  provider: ProviderInterface | undefined;
  setProvider: (provider: ProviderInterface | undefined) => void; // Fixed to allow undefined

  isConnected: boolean;
  setConnected: (isConnected: boolean) => void;

  displaySelectWalletUI: boolean;
  setSelectWalletUI: (displaySelectWalletUI: boolean) => void;

  walletApiList: string[];
  setWalletApiList: (walletApi: string[]) => void;
  selectedApiVersion: string;
  setSelectedApiVersion: (version: string) => void;

  lastConnectedConnectorId: string | undefined;
  setLastConnectedConnectorId: (id: string | undefined) => void;

  // New function to reset wallet state
  resetWalletState: () => void;
}

export const useStoreWallet = create<WalletState>()(
  persist(
    (set) => ({
      activeConnector: undefined,
      setActiveConnector: (connector: Connector | undefined) => {
        set({ activeConnector: connector });
      },

      address: "",
      setAddressAccount: (address: string) => {
        set({ address });
      },

      chain: "",
      setChain: (chain: string) => {
        set({ chain: chain });
      },

      account: undefined,
      setAccount: (account: AccountInterface | undefined) => {
        // Fixed to allow undefined
        set({ account });
      },

      provider: undefined,
      setProvider: (provider: ProviderInterface | undefined) => {
        // Fixed to allow undefined
        set({ provider: provider });
      },

      isConnected: false,
      setConnected: (isConnected: boolean) => {
        set({ isConnected });
      },

      displaySelectWalletUI: false,
      setSelectWalletUI: (displaySelectWalletUI: boolean) => {
        set({ displaySelectWalletUI });
      },

      walletApiList: [],
      setWalletApiList: (walletApi: string[]) => {
        set({ walletApiList: walletApi });
      },
      selectedApiVersion: "default",
      setSelectedApiVersion: (selectedApiVersion: string) => {
        set({ selectedApiVersion });
      },

      lastConnectedConnectorId: undefined,
      setLastConnectedConnectorId: (id: string | undefined) => {
        set({ lastConnectedConnectorId: id });
      },

      // New reset function to clear wallet state
      resetWalletState: () => {
        set({
          activeConnector: undefined,
          address: "",
          chain: "",
          account: undefined,
          provider: undefined,
          isConnected: false,
          lastConnectedConnectorId: undefined,
        });
        // Clear localStorage specifically for wallet-storage
        localStorage.removeItem("wallet-storage");
      },
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lastConnectedConnectorId: state.lastConnectedConnectorId,
        address: state.address,
        chain: state.chain,
        isConnected: state.isConnected,
        selectedApiVersion: state.selectedApiVersion,
      }),
    },
  ),
);
