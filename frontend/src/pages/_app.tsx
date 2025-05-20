import { FC, useEffect } from 'react';
import { StarknetConfig, InjectedConnector, infuraProvider } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  // Set up connectors for Starknet wallets
  const connectors = [
    new InjectedConnector({ options: { id: 'braavos' } }),
    new InjectedConnector({ options: { id: 'argentX' } }),
  ];

  // Add debugging for connectors
  useEffect(() => {
    console.log('StarknetConfig initialized with connectors:', connectors);
    
    // Check if window.starknet is available (wallet extensions)
    if (typeof window !== 'undefined') {
      console.log('Window starknet object:', window.starknet);
    }
  }, []);

  // Configure provider for Sepolia testnet using infuraProvider
  const provider = infuraProvider({
    apiKey: process.env.NEXT_PUBLIC_PROVIDER_URL?.split('/').pop() || '0d3e154c01d243f3be0e42d3b861bc9e'
  });

  // Log provider details
  useEffect(() => {
    console.log('Provider initialized:', provider);
  }, [provider]);

  return (
    <StarknetConfig 
      autoConnect 
      connectors={connectors} 
      provider={provider}
      chains={[sepolia]}
    >
      <Component {...pageProps} />
    </StarknetConfig>
  );
};

export default MyApp;
