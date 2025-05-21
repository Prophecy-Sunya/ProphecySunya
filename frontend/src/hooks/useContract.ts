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
  prediction: (process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS || '0x1234') as `0x${string}`, 
  nft: (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x5678') as `0x${string}`,
  gasTank: (process.env.NEXT_PUBLIC_GAS_TANK_CONTRACT_ADDRESS || '0x9abc') as `0x${string}`,
  oracle: (process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS || '0xdef0') as `0x${string}`,
  governance: (process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS || '0x1234') as `0x${string}`,
  bridge: (process.env.NEXT_PUBLIC_BRIDGE_CONTRACT_ADDRESS || '0x5678') as `0x${string}`,
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

// Directly define the prediction ABI to ensure it's in the correct format
const PREDICTION_ABI = [
  {
    type: 'function',
    name: 'create_prediction',
    inputs: [
      { name: 'content', type: 'felt252' },
      { name: 'category', type: 'felt252' },
      { name: 'expiration_time', type: 'felt252' }
    ],
    outputs: [{ name: 'prediction_id', type: 'felt252' }],
    stateMutability: 'external'
  },
  {
    type: 'function',
    name: 'verify_prediction',
    inputs: [
      { name: 'prediction_id', type: 'felt252' },
      { name: 'verification_result', type: 'felt252' },
      { name: 'oracle_signature', type: 'felt252' }
    ],
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'external'
  },
  {
    type: 'function',
    name: 'get_prediction',
    inputs: [{ name: 'prediction_id', type: 'felt252' }],
    outputs: [{ name: 'prediction', type: 'Prediction' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'get_user_predictions',
    inputs: [{ name: 'user', type: 'ContractAddress' }],
    outputs: [{ name: 'prediction_ids', type: 'Array<felt252>' }],
    stateMutability: 'view'
  }
];

// Contract ABIs - ensure they're all in array format
const CONTRACT_ABIS = {
  prediction: PREDICTION_ABI, // Use the directly defined ABI
  nft: ensureAbiArray(nftAbi),
  gasTank: ensureAbiArray(gasTankAbi),
  oracle: ensureAbiArray(oracleAbi),
  governance: ensureAbiArray(governanceAbi),
  bridge: ensureAbiArray(bridgeAbi),
};

type ContractType = keyof typeof CONTRACT_ADDRESSES;

export const useContract = (contractType: ContractType) => {
  const { address } = useAccount();
  const { contract } = useStarknetContract({
    address: CONTRACT_ADDRESSES[contractType],
    abi: CONTRACT_ABIS[contractType] as Abi,
  });
  
  // Mock contract functionality for contractless operation
  const [mockContract, setMockContract] = useState<any>(null);
  
  useEffect(() => {
    // Create a mock contract when no real contract is available
    if (!contract) {
      console.log(`Creating mock contract for ${contractType}`);
      
      // Simple mock contract implementation with basic functionality
      const mock = {
        // Mock functions that would be available on the real contract
        create_prediction: async (args: any) => {
          console.log('Mock contract: create_prediction called with:', args);
          // Return a mock transaction hash
          return { transaction_hash: `0x${Math.random().toString(16).substring(2, 42)}` };
        },
        mint_nft: async (args: any) => {
          console.log('Mock contract: mint_nft called with:', args);
          // Return a mock transaction hash
          return { transaction_hash: `0x${Math.random().toString(16).substring(2, 42)}` };
        },
        get_predictions: async () => {
          console.log('Mock contract: get_predictions called');
          // Return mock predictions
          return [
            { id: '1', content: 'ETH will reach $10,000', category: 'Crypto', creator: address || '0x123', expiration_time: Date.now() + 86400000 * 30, verification_status: 'PENDING' },
            { id: '2', content: 'BTC will have another halving', category: 'Crypto', creator: address || '0x456', expiration_time: Date.now() + 86400000 * 60, verification_status: 'VERIFIED_TRUE' }
          ];
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
  }, [contract, contractType, address]);

  return useMemo(() => {
    const finalContract = contract || mockContract;
    
    return {
      // Expose contract methods with a consistent interface
      invoke: async (method: string, args: any) => {
        console.log(`Real contract: invoking ${method} with:`, args);
        return finalContract.invoke(method, args);
      },
      call: async (method: string, args: any) => {
        console.log(`Real contract: calling ${method} with:`, args);
        return finalContract.call(method, args);
      },
      // Add convenience methods that match the expected interface
      create_prediction: async (args: any) => {
        console.log('Real contract: create_prediction called with:', args);
        // Extract arguments from the args object
        const content = args.content;
        const category = args.category;
        const expiration_time = args.expiration_time.toString();
        
        console.log('Extracted arguments:', { content, category, expiration_time });
        
        // Use direct function call if available, otherwise fall back to invoke
        if (finalContract.functions && finalContract.functions.create_prediction) {
          console.log('Using direct function call with separate arguments');
          // Pass arguments separately, not as an object
          return finalContract.functions.create_prediction(
            content,
            category,
            expiration_time
          );
        } else {
          console.log('Using invoke with array of arguments');
          return finalContract.invoke('create_prediction', [
            content,
            category,
            expiration_time
          ]);
        }
      },
      verify_prediction: async (args: any) => {
        console.log('Real contract: verify_prediction called with:', args);
        // Use direct function call if available, otherwise fall back to invoke
        if (finalContract.functions && finalContract.functions.verify_prediction) {
          return finalContract.functions.verify_prediction(
            args.prediction_id,
            args.verification_result,
            args.oracle_signature || '0x0'
          );
        } else {
          return finalContract.invoke('verify_prediction', [
            args.prediction_id,
            args.verification_result,
            args.oracle_signature || '0x0'
          ]);
        }
      },
      get_prediction: async (predictionId: string) => {
        console.log('Real contract: get_prediction called with:', predictionId);
        // Use direct function call if available, otherwise fall back to call
        if (starknetContract.functions && starknetContract.functions.get_prediction) {
          return starknetContract.functions.get_prediction(predictionId);
        } else {
          return starknetContract.call('get_prediction', [predictionId]);
        }
      },
      get_user_predictions: async (userAddress: string) => {
        console.log('Real contract: get_user_predictions called with:', userAddress);
        // Use direct function call if available, otherwise fall back to call
        if (starknetContract.functions && starknetContract.functions.get_user_predictions) {
          return starknetContract.functions.get_user_predictions(userAddress || address);
        } else {
          return starknetContract.call('get_user_predictions', [userAddress || address]);
        }
      },
      // Add the original contract for advanced usage
      _contract: starknetContract
    };
  }, [contract, mockContract, contractType]);
};
