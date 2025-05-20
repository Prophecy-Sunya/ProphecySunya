import { FC } from 'react';
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

  // Configure provider for Sepolia testnet using infuraProvider
  const provider = infuraProvider({
    apiKey: process.env.NEXT_PUBLIC_PROVIDER_URL?.split('/').pop() || '0d3e154c01d243f3be0e42d3b861bc9e'
  });

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
