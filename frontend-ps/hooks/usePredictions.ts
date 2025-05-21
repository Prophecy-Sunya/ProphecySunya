import { useState, useEffect } from 'react';
import { useAccount } from '@starknet-react/core';

// Define the Prediction interface
export interface Prediction {
  id: string;
  content: string;
  category: string;
  creator: string;
  expirationTime: number;
  verificationStatus: 'PENDING' | 'VERIFIED_TRUE' | 'VERIFIED_FALSE';
}

export const usePredictions = (userAddress?: string) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { address: account } = useAccount();

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        
        // In a production app, this would fetch from the actual contract
        // For now, we'll use mock data
        const mockPredictions: Prediction[] = [
          {
            id: '1',
            content: 'Ethereum will reach $10,000 by the end of 2025',
            category: 'Crypto',
            creator: userAddress || account || '0x123...456',
            expirationTime: new Date(2025, 11, 31).getTime(),
            verificationStatus: 'PENDING'
          },
          {
            id: '2',
            content: 'Bitcoin will have another halving in April 2024',
            category: 'Crypto',
            creator: '0x789...012',
            expirationTime: new Date(2024, 3, 30).getTime(),
            verificationStatus: 'VERIFIED_TRUE'
          },
          {
            id: '3',
            content: 'Starknet TVL will exceed $1B in 2024',
            category: 'DeFi',
            creator: '0x345...678',
            expirationTime: new Date(2024, 11, 31).getTime(),
            verificationStatus: 'PENDING'
          }
        ];
        
        // Filter by user if address is provided
        const filteredPredictions = userAddress 
          ? mockPredictions.filter(p => p.creator === userAddress)
          : mockPredictions;
          
        setPredictions(filteredPredictions);
        setError(null);
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch predictions'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [account, userAddress]);

  return { predictions, isLoading, error };
};
