# Starknet Package Compatibility Guide

This document provides guidance on resolving compatibility issues between Starknet packages in the ProphecySunya project.

## Starknet.js and @starknet-react/core Compatibility

### Version Requirements

| Package | Required Version | Notes |
|---------|-----------------|-------|
| starknet | ≥6.11.0 | Required for WalletAccount export |
| @starknet-react/core | 3.7.4 | Requires starknet ≥6.11.0 |
| @starknet-react/chains | 3.1.3 | Compatible with above versions |
| @starknet-io/get-starknet | 4.0.7 | Compatible with above versions |

### Common Compatibility Issues

1. **Missing WalletAccount Export**
   - Error: `The requested module 'starknet' does not provide an export named 'WalletAccount'`
   - Cause: Using starknet.js <6.11.0 with @starknet-react/core ≥3.0.0
   - Solution: Upgrade starknet.js to ≥6.11.0

2. **Incorrect Peer Dependencies**
   - Warning: `has incorrect peer dependency "starknet@^6.11.0"`
   - Cause: Using starknet.js <6.11.0 with @starknet-react/core
   - Solution: Upgrade starknet.js to match peer dependency requirements

3. **Missing get-starknet-core**
   - Warning: `has unmet peer dependency "get-starknet-core@^4.0.0"`
   - Solution: Add resolutions for consistent dependency versions

## Best Practices

1. **Use Resolutions in package.json**
   ```json
   "resolutions": {
     "starknet": "6.11.0"
   }
   ```

2. **Pin Exact Versions**
   - Use exact versions (without ^ or ~) to prevent automatic updates
   - This ensures consistent behavior across environments

3. **Check Changelogs**
   - Starknet.js introduces breaking changes between minor versions
   - Always check the changelog when upgrading

## Troubleshooting

If you encounter compatibility issues:

1. Check the installed versions with `yarn list starknet`
2. Verify peer dependencies with `yarn info @starknet-react/core peerDependencies`
3. Clear node_modules and reinstall with `rm -rf node_modules && yarn install`
4. Use yarn resolutions to force specific versions

## Additional Resources

- [Starknet.js Documentation](https://starknetjs.com/docs/)
- [Starknet React Documentation](https://www.starknet-react.com/docs/)
- [Starknet.js Changelog](https://github.com/starknet-io/starknet.js/blob/develop/CHANGELOG.md)
