# Starknet React v3 Migration Guide

This document provides guidance on migrating from older versions of starknet-react to v3, which includes several breaking changes.

## Key API Changes

### 1. Hooks Replacement

| Old Hook | New Hook(s) | Notes |
|----------|-------------|-------|
| `useStarknet()` | `useAccount()` | For account address, use `address` property instead of `account` |
| `useContractRead()` | `useReadContract()` | Now type-safe with ABI |
| `useContractWrite()` | `useSendTransaction()` | Expects a list of `Call`s |
| `useWaitForTransaction()` | `useTransactionReceipt()` | - |

### 2. Provider Configuration

The StarknetConfig component now requires:
- `chains` array (e.g., `[sepolia]`)
- Provider factory instead of direct Provider instance

```tsx
// Old way
<StarknetProvider>...</StarknetProvider>

// New way
<StarknetConfig 
  autoConnect 
  connectors={connectors} 
  provider={infuraProvider({ apiKey: "..." })}
  chains={[sepolia]}
>
  ...
</StarknetConfig>
```

### 3. Wallet Connection

The wallet connection flow has been updated:

```tsx
// Old way
const { connect, connectors } = useConnect();
await connect(connector);

// New way
const { connect, connectors } = useConnect();
await connect({ connector });
```

## Common Issues and Solutions

### 1. React Hydration Errors

When using Next.js Link with Material UI components, use `legacyBehavior`:

```tsx
// Incorrect (causes nested <a> tags)
<Link href="/about" passHref>
  <MuiLink>About</MuiLink>
</Link>

// Correct
<Link href="/about" passHref legacyBehavior>
  <MuiLink>About</MuiLink>
</Link>
```

### 2. Contract Interaction

Contract interaction now uses typed contracts:

```tsx
// Old way
const { contract } = useContract({ ... });
await contract.transfer(recipient, amount);

// New way
const { contract } = useContract({ ... });
const calls = contract.populate("transfer", [recipient, amount]);
await sendTransaction({ calls });
```

## Required Dependencies

- `@starknet-react/core`: v3.7.4+
- `@starknet-react/chains`: v3.1.3+
- `starknet`: v6.11.0+
- `@starknet-io/get-starknet`: v4.0.7+

## Testing

After migration, test the following functionality:
1. Wallet connection and disconnection
2. Account address display
3. Contract reads and writes
4. Transaction status monitoring
5. Chain switching (if applicable)

## Additional Resources

- [Starknet React Documentation](https://www.starknet-react.com/docs)
- [Starknet.js Documentation](https://www.starknetjs.com/docs/)
