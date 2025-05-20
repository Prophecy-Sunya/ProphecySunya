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

// Contract addresses - these would be updated based on deployment
const CONTRACT_ADDRESSES = {
  prediction: '0x1234', // Replace with actual address after deployment
  nft: '0x5678', // Replace with actual address after deployment
  gasTank: '0x9abc', // Replace with actual address after deployment
  oracle: '0xdef0', // Replace with actual address after deployment
  governance: '0x1234', // Replace with actual address after deployment
  bridge: '0x5678', // Replace with actual address after deployment
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
