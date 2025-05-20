import { useState, useEffect } from 'react';
import { useAccount } from '@starknet-react/core';

export const useWalletStatus = () => {
  const { address: account } = useAccount();
  const [isConnected, setIsConnected] = useState(false);
  const [shortAddress, setShortAddress] = useState('');

  useEffect(() => {
    if (account) {
      setIsConnected(true);
      setShortAddress(`${account.substring(0, 6)}...${account.substring(account.length - 4)}`);
    } else {
      setIsConnected(false);
      setShortAddress('');
    }
  }, [account]);

  return {
    isConnected,
    shortAddress,
    fullAddress: account
  };
};
