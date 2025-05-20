// This file ensures Next.js TypeScript types are properly recognized
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// It's used to help TypeScript recognize Next.js types
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_STARKNET_NETWORK: string;
    NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS: string;
    NEXT_PUBLIC_NFT_CONTRACT_ADDRESS: string;
    NEXT_PUBLIC_GAS_TANK_CONTRACT_ADDRESS: string;
    NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS: string;
    NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS: string;
    NEXT_PUBLIC_BRIDGE_CONTRACT_ADDRESS: string;
  }
}
