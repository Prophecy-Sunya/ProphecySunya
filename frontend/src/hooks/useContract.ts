import { useContract as useStarknetContract } from '@starknet-react/core';
import { Abi, Contract } from 'starknet';
import { useMemo } from 'react';

// Import contract ABIs
import predictionAbi from '../abi/prediction_abi.json';
import nftAbi from '../abi/nft_abi.json';
import gasTankAbi from '../abi/gas_tank_abi.json';
import oracleAbi from '../abi/oracle_abi.json';
import governanceAbi from '../abi/governance_abi.json';
import bridgeAbi from '../abi/bridge_abi.json';

// Contract addresses for Sepolia testnet
const CONTRACT_ADDRESSES = {
  // These would be the actual deployed contract addresses on Sepolia
  prediction: process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS || '0x1234', 
  nft: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x5678',
  gasTank: process.env.NEXT_PUBLIC_GAS_TANK_CONTRACT_ADDRESS || '0x9abc',
  oracle: process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS || '0xdef0',
  governance: process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS || '0x1234',
  bridge: process.env.NEXT_PUBLIC_BRIDGE_CONTRACT_ADDRESS || '0x5678',
};

// Contract ABIs
const CONTRACT_ABIS = {
  prediction: predictionAbi,
  nft: nftAbi,
  gasTank: gasTankAbi,
  oracle: oracleAbi,
  governance: governanceAbi,
  bridge: bridgeAbi,
};

type ContractType = keyof typeof CONTRACT_ADDRESSES;

export const useContract = (contractType: ContractType) => {
  const { contract } = useStarknetContract({
    address: CONTRACT_ADDRESSES[contractType],
    abi: CONTRACT_ABIS[contractType] as Abi,
  });

  return useMemo(() => {
    return {
      contract,
      isLoading: !contract,
      error: !contract ? new Error(`Contract ${contractType} not loaded`) : null,
    };
  }, [contract, contractType]);
};
