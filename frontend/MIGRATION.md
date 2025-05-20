# Starknet React Migration Guide

This document provides guidance on migrating from the deprecated `starknet-react` package to the current `@starknet-react/core` package.

## Package Changes

The following packages have been updated:

1. Removed `starknet-react` (deprecated)
2. Added `@starknet-react/core` (current version 3.7.4)
3. Added `@starknet-react/chains` (current version 3.1.3)
4. Updated `starknet` from v5.19.5 to v6.0.0 (required for compatibility)
5. Updated `@starknet-io/get-starknet` to v4.0.7 (latest version)

## API Changes

The new `@starknet-react/core` package maintains similar API patterns to the deprecated package, but with some improvements and changes:

- Hooks like `useStarknet`, `useConnectors`, and `useContract` continue to work with similar patterns
- Provider configuration has been updated to work with Starknet.js v6
- Wallet connection flow remains similar but with enhanced features

## Code Migration

All imports from `starknet-react` should be updated to import from `@starknet-react/core`. For example:

```typescript
// Old
import { useStarknet } from 'starknet-react';

// New
import { useStarknet } from '@starknet-react/core';
```

## Compatibility Notes

- `@starknet-react/core` requires Starknet.js v6.0.0 or higher
- `@starknet-io/get-starknet` v4.0.7 is the latest version as of May 2025
- The package is compatible with Next.js 14 and React 18
- For chain configuration, consider using `@starknet-react/chains` package

## Additional Resources

- [Starknet React Documentation](https://www.starknet-react.com/docs/getting-started)
- [Starknet.js Documentation](https://starknetjs.com/docs/next/guides/walletAccount)
