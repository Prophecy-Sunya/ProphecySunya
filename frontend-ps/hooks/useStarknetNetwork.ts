import { FC, useEffect, useState } from 'react';
import { useStarknetProvider } from '@starknet-react/core';

export const useStarknetNetwork = () => {
  const { provider } = useStarknetProvider();
  const [network, setNetwork] = useState<string>('');
  const [isTestnet, setIsTestnet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getNetwork = async () => {
      if (!provider) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const chainId = await provider.getChainId();
        
        // Check if we're on Sepolia testnet
        if (chainId === 'SN_SEPOLIA') {
          setNetwork('Sepolia Testnet');
          setIsTestnet(true);
        } else if (chainId === 'SN_MAIN') {
          setNetwork('Mainnet');
          setIsTestnet(false);
        } else if (chainId === 'SN_GOERLI') {
          setNetwork('Goerli Testnet');
          setIsTestnet(true);
        } else {
          setNetwork(`Unknown (${chainId})`);
          setIsTestnet(true);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error getting network:', err);
        setError(err instanceof Error ? err : new Error('Failed to get network'));
        setNetwork('Unknown');
      } finally {
        setIsLoading(false);
      }
    };

    getNetwork();
  }, [provider]);

  return { network, isTestnet, isLoading, error };
};
