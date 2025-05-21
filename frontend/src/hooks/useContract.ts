import { useContract as useStarknetContract } from '@starknet-react/core';
import { Abi, Contract } from 'starknet';
import { useMemo, useState, useEffect } from 'react';
import { useAccount } from '@starknet-react/core';

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

// Ensure ABIs are in array format and include Cairo version metadata
const ensureAbiArray = (abi: any): any[] => {
  let abiArray: any[] = [];
  
  // First, extract the array from the ABI object if needed
  if (Array.isArray(abi)) {
    abiArray = abi;
  } else if (abi && typeof abi === 'object') {
    // Try to find the first property that is an array
    for (const key in abi) {
      if (Array.isArray(abi[key])) {
        abiArray = abi[key];
        break;
      }
    }
  }
  
  // If we still don't have an array, return an empty one with Cairo metadata
  if (abiArray.length === 0) {
    console.warn('Invalid ABI format, using empty array with Cairo metadata');
    return [{ type: 'struct', name: 'EmptyStruct', members: [] }];
  }
  
  // Check if the ABI already has Cairo version metadata
  const hasCairoMetadata = abiArray.some(item => 
    item.type === 'interface' || 
    item.type === 'constructor' || 
    (item.type === 'function' && item.stateMutability) ||
    item.cairo_type
  );
  
  // If no Cairo metadata is found, add it to make it compatible with Cairo 1
  if (!hasCairoMetadata) {
    console.log('Adding Cairo 1 metadata to ABI');
    
    // Add a version identifier that starknet.js can recognize
    abiArray.unshift({
      type: 'interface',
      name: 'ProphecySunyaContract',
      items: []
    });
    
    // Ensure all function items have required Cairo 1 properties
    abiArray = abiArray.map(item => {
      if (item.type === 'function' || item.name) {
        return {
          ...item,
          stateMutability: item.stateMutability || 'view',
        };
      }
      return item;
    });
  }
  
  return abiArray;
};

// Contract ABIs - ensure they're all in array format
const CONTRACT_ABIS = {
  prediction: ensureAbiArray(predictionAbi),
  nft: ensureAbiArray(nftAbi),
  gasTank: ensureAbiArray(gasTankAbi),
  oracle: ensureAbiArray(oracleAbi),
  governance: ensureAbiArray(governanceAbi),
  bridge: ensureAbiArray(bridgeAbi),
};

type ContractType = keyof typeof CONTRACT_ADDRESSES;

export const useContract = (contractType: ContractType) => {
  const { address } = useAccount();
  const { contract: starknetContract } = useStarknetContract({
    address: CONTRACT_ADDRESSES[contractType],
    abi: CONTRACT_ABIS[contractType] as Abi,
  });
  
  // Mock contract functionality for contractless operation
  const [mockContract, setMockContract] = useState<any>(null);
  
  // Create a wrapper for the real contract that exposes methods in a consistent way
  const wrappedContract = useMemo(() => {
    if (!starknetContract) return null;
    
    console.log(`Creating wrapped contract for ${contractType}`);
    
    return {
      // Expose contract methods with a consistent interface
      invoke: async (method: string, args: any) => {
        console.log(`Real contract: invoking ${method} with:`, args);
        return starknetContract.invoke(method, args);
      },
      call: async (method: string, args: any) => {
        console.log(`Real contract: calling ${method} with:`, args);
        return starknetContract.call(method, args);
      },
      // Add convenience methods that match the expected interface
      create_prediction: async (args: any) => {
        console.log('Real contract: create_prediction called with:', args);
        return starknetContract.invoke('create_prediction', [
          args.content,
          args.category,
          args.expiration_time
        ]);
      },
      verify_prediction: async (args: any) => {
        console.log('Real contract: verify_prediction called with:', args);
        return starknetContract.invoke('verify_prediction', [
          args.prediction_id,
          args.verification_result,
          args.oracle_signature || '0x0'
        ]);
      },
      get_prediction: async (predictionId: string) => {
        console.log('Real contract: get_prediction called with:', predictionId);
        return starknetContract.call('get_prediction', [predictionId]);
      },
      get_user_predictions: async (userAddress: string) => {
        console.log('Real contract: get_user_predictions called with:', userAddress);
        return starknetContract.call('get_user_predictions', [userAddress || address]);
      },
      // Add the original contract for advanced usage
      _contract: starknetContract
    };
  }, [starknetContract, contractType, address]);
  
  useEffect(() => {
    // Create a mock contract when no real contract is available
    if (!wrappedContract) {
      console.log(`Creating mock contract for ${contractType}`);
      
      // Mock contract implementation with the same interface as the wrapped contract
      const mock = {
        // Mock the invoke and call methods
        invoke: async (method: string, args: any) => {
          console.log(`Mock contract: invoking ${method} with:`, args);
          return { transaction_hash: `0x${Math.random().toString(16).substring(2, 42)}` };
        },
        call: async (method: string, args: any) => {
          console.log(`Mock contract: calling ${method} with:`, args);
          if (method === 'get_prediction') {
            return {
              id: '1',
              content: 'ETH will reach $10,000',
              category: 'Crypto',
              creator: address || '0x123',
              expiration_time: Date.now() + 86400000 * 30,
              verification_status: 'PENDING'
            };
          }
          if (method === 'get_user_predictions') {
            return ['1', '2'];
          }
          return null;
        },
        // Mock convenience methods
        create_prediction: async (args: any) => {
          console.log('Mock contract: create_prediction called with:', args);
          // Return a mock transaction hash
          return { transaction_hash: `0x${Math.random().toString(16).substring(2, 42)}` };
        },
        verify_prediction: async (args: any) => {
          console.log('Mock contract: verify_prediction called with:', args);
          // Return a mock transaction hash
          return { transaction_hash: `0x${Math.random().toString(16).substring(2, 42)}` };
        },
        get_prediction: async (predictionId: string) => {
          console.log('Mock contract: get_prediction called with:', predictionId);
          return {
            id: predictionId,
            content: 'ETH will reach $10,000',
            category: 'Crypto',
            creator: address || '0x123',
            expiration_time: Date.now() + 86400000 * 30,
            verification_status: 'PENDING'
          };
        },
        get_user_predictions: async (userAddress: string) => {
          console.log('Mock contract: get_user_predictions called with:', userAddress);
          return ['1', '2'];
        },
        // Add mock functions for NFT operations
        mint_nft: async (args: any) => {
          console.log('Mock contract: mint_nft called with:', args);
          // Return a mock transaction hash
          return { transaction_hash: `0x${Math.random().toString(16).substring(2, 42)}` };
        },
        get_nfts: async () => {
          console.log('Mock contract: get_nfts called');
          // Return mock NFTs
          return [
            { id: '1', prediction_id: '1', owner: address || '0x123', prophet_score: 85 },
            { id: '2', prediction_id: '2', owner: address || '0x123', prophet_score: 95 }
          ];
        }
      };
      
      setMockContract(mock);
    }
  }, [wrappedContract, contractType, address]);

  return useMemo(() => {
    const finalContract = wrappedContract || mockContract;
    
    return {
      contract: finalContract,
      isLoading: !finalContract,
      error: !finalContract ? new Error(`Contract ${contractType} not loaded`) : null,
      isMock: !wrappedContract && !!mockContract
    };
  }, [wrappedContract, mockContract, contractType]);
};
