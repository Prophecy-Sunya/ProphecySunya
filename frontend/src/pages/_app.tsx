import { FC } from 'react';
import { StarknetConfig, InjectedConnector } from '@starknet-react/core';
import { Provider } from 'starknet';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  // Set up connectors for Starknet wallets
  const connectors = [
    new InjectedConnector({ options: { id: 'braavos' } }),
    new InjectedConnector({ options: { id: 'argentX' } }),
  ];

  // Configure provider for Sepolia testnet
  const provider = new Provider({
    sequencer: {
      network: 'sepolia-testnet',
      baseUrl: process.env.NEXT_PUBLIC_PROVIDER_URL,
    },
  });

  return (
    <StarknetConfig autoConnect connectors={connectors} provider={provider}>
      <Component {...pageProps} />
    </StarknetConfig>
  );
};

export default MyApp;
