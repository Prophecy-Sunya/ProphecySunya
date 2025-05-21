import { useContract as useStarknetContract } from '@starknet-react/core';
import { Abi, Contract } from 'starknet';
import { useMemo } from 'react';
import { useAccount } from '@starknet-react/core';

// Import contract ABIs
import predictionAbi from '../abi/prediction_abi.json';
import nftAbi from '../abi/nft_abi.json';
import gasTankAbi from '../abi/gas_tank_abi.json';
import oracleAbi from '../abi/oracle_abi.json';
import governanceAbi from '../abi/governance_abi.json';
import bridgeAbi from '../abi/bridge_abi.json';

// Contract addresses for Sepolia testnet
const CONTRACT_ADDRESSES: Record<string, `0x${string}`> = {
  // These would be the actual deployed contract addresses on Sepolia
  prediction: (process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS || '0x1234') as `0x${string}`, 
  nft: (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x5678') as `0x${string}`,
  gasTank: (process.env.NEXT_PUBLIC_GAS_TANK_CONTRACT_ADDRESS || '0x9abc') as `0x${string}`,
  oracle: (process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS || '0xdef0') as `0x${string}`,
  governance: (process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS || '0x1234') as `0x${string}`,
  bridge: (process.env.NEXT_PUBLIC_BRIDGE_CONTRACT_ADDRESS || '0x5678') as `0x${string}`,
};

// Ensure ABIs are in array format, flattened, and include Cairo version metadata
const ensureAbiArray = (abi: any): any[] => {
  let abiArray: any[] = [];
  
  console.log('Original ABI structure:', JSON.stringify(abi).substring(0, 200) + '...');
  
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
    return [{ type: 'function', name: 'placeholder', inputs: [], outputs: [], stateMutability: 'view' }];
  }
  
  // Flatten the ABI structure if needed (extract functions from members array)
  let flattenedAbi: any[] = [];
  
  for (const item of abiArray) {
    // If the item has a members array, extract those as top-level functions
    if (item.members && Array.isArray(item.members)) {
      console.log('Flattening members array with', item.members.length, 'functions');
      
      // Add each member as a top-level function
      for (const member of item.members) {
        if (member.type === 'function' || member.name) {
          flattenedAbi.push({
            ...member,
            type: member.type || 'function',
            stateMutability: member.stateMutability || 'view',
            // Ensure name is explicitly set for all functions
            name: member.name
          });
        }
      }
    } 
    // Otherwise add the item directly
    else {
      flattenedAbi.push(item);
    }
  }
  
  // Debug log to verify function names are correctly extracted
  console.log('Extracted function names:', flattenedAbi.map(item => item.name).join(', '));
  
  // If we have no functions after flattening, add a placeholder
  if (flattenedAbi.length === 0) {
    console.warn('No functions found after flattening, using placeholder');
    flattenedAbi = [{ type: 'function', name: 'placeholder', inputs: [], outputs: [], stateMutability: 'view' }];
  }
  
  // Check if the ABI already has Cairo version metadata
  const hasCairoMetadata = flattenedAbi.some(item => 
    item.type === 'interface' || 
    item.type === 'constructor' || 
    (item.type === 'function' && item.stateMutability) ||
    item.cairo_type
  );
  
  // If no Cairo metadata is found, add it to make it compatible with Cairo 1
  if (!hasCairoMetadata) {
    console.log('Adding Cairo 1 metadata to ABI');
    
    // Add a version identifier that starknet.js can recognize
    flattenedAbi.unshift({
      type: 'interface',
      name: 'ProphecySunyaContract',
      items: []
    });
    
    // Ensure all function items have required Cairo 1 properties
    flattenedAbi = flattenedAbi.map(item => {
      if (item.type === 'function' || item.name) {
        return {
          ...item,
          stateMutability: item.stateMutability || 'view',
        };
      }
      return item;
    });
  }
  
  console.log('Flattened ABI contains', flattenedAbi.length, 'items');
  console.log('Function names:', flattenedAbi.filter(item => item.type === 'function').map(item => item.name).join(', '));
  
  return flattenedAbi;
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
  const { contract: starknetContract } = useStarknetContract({
    address: CONTRACT_ADDRESSES[contractType],
    abi: CONTRACT_ABIS[contractType] as Abi,
  });
  
  // Create a wrapper for the real contract that exposes methods in a consistent way
  const wrappedContract = useMemo(() => {
    if (!starknetContract) return null;
    
    console.log(`Creating wrapped contract for ${contractType}`);
    
    // Log the actual ABI being used to help debug
    console.log('Contract ABI structure:', JSON.stringify(starknetContract.abi).substring(0, 500) + '...');
    console.log('Available functions:', Object.keys(starknetContract.functions || {}).join(', '));
    
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
        // Convert args to array format for Starknet.js
        const callArgs = [
          args.content,
          args.category,
          args.expiration_time.toString()
        ];
        console.log('Calling with args:', callArgs);
        
        // Use direct function call if available, otherwise fall back to invoke
        if (starknetContract.functions && starknetContract.functions.create_prediction) {
          return starknetContract.functions.create_prediction(
            args.content,
            args.category,
            args.expiration_time.toString()
          );
        } else {
          return starknetContract.invoke('create_prediction', callArgs);
        }
      },
      verify_prediction: async (args: any) => {
        console.log('Real contract: verify_prediction called with:', args);
        // Use direct function call if available, otherwise fall back to invoke
        if (starknetContract.functions && starknetContract.functions.verify_prediction) {
          return starknetContract.functions.verify_prediction(
            args.prediction_id,
            args.verification_result,
            args.oracle_signature || '0x0'
          );
        } else {
          return starknetContract.invoke('verify_prediction', [
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
  }, [starknetContract, contractType, address]);
  
  return {
    contract: wrappedContract,
    isLoading: !wrappedContract,
    error: !wrappedContract ? new Error(`Contract ${contractType} not loaded`) : null,
    isMock: false
  };
};
