# Starknet React Configuration Guide

This document provides guidance on configuring Starknet React in the ProphecySunya project.

## Provider Configuration

### Current Implementation

The application uses `@starknet-react/core` v3.7.4, which requires a specific provider configuration:

```tsx
// Correct configuration
import { StarknetConfig, infuraProvider } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';

// Configure provider using a provider factory
const provider = infuraProvider({
  apiKey: 'your-infura-api-key'
});

// Pass provider, chains, and connectors to StarknetConfig
<StarknetConfig 
  autoConnect 
  connectors={connectors} 
  provider={provider}
  chains={[sepolia]}
>
  {children}
</StarknetConfig>
```

### Common Configuration Issues

1. **Missing chains array**
   - Error: `TypeError: Cannot read properties of undefined (reading '0')`
   - Solution: Always provide a `chains` array to StarknetConfig

2. **Direct Provider instance**
   - Error: `Using default public node url, please provide nodeUrl in provider options!`
   - Solution: Use provider factories (infuraProvider, jsonRpcProvider, etc.) instead of direct starknet.js Provider instances

3. **Missing API key**
   - Warning: Using default public node URL
   - Solution: Provide the API key for your chosen provider

## Provider Options

### Available Provider Factories

- `publicProvider()` - Free public provider (limited usage)
- `infuraProvider({ apiKey })` - Infura provider
- `alchemyProvider({ apiKey })` - Alchemy provider
- `blastProvider({ apiKey })` - Blast provider
- `jsonRpcProvider({ rpc })` - Custom RPC provider

### Example with Custom JSON-RPC

```tsx
import { jsonRpcProvider } from "@starknet-react/core";
import { Chain } from "@starknet-react/chains";

function rpc(chain: Chain) {
  return {
    nodeUrl: `https://${chain.network}.example.org`
  }
}

const provider = jsonRpcProvider({ rpc });
```

## Chains Configuration

Always include the chains you want to support:

```tsx
import { sepolia, mainnet } from '@starknet-react/chains';

// For Sepolia testnet only
<StarknetConfig chains={[sepolia]} ... >

// For both Mainnet and Sepolia
<StarknetConfig chains={[mainnet, sepolia]} ... >
```

## Wallet Connectors

Configure wallet connectors to support different wallet providers:

```tsx
import { InjectedConnector } from '@starknet-react/core';

const connectors = [
  new InjectedConnector({ options: { id: 'braavos' } }),
  new InjectedConnector({ options: { id: 'argentX' } }),
];
```

## Additional Resources

- [Starknet React Documentation](https://www.starknet-react.com/docs/)
- [Starknet.js Documentation](https://starknetjs.com/docs/)
