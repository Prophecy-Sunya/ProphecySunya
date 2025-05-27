# Scarb Build Configuration Fix

## Issue
After fixing all the deployment script issues, we encountered a more fundamental problem:
```
Searching for prediction contract in 0 available contracts
```

The artifact file (`prophecy_sunya.starknet_artifacts.json`) was being found, but it contained zero contracts.

## Root Cause Analysis
The issue was related to the Scarb.toml configuration:

1. **Missing Explicit Contract Targets**: The Scarb.toml file had workspace members defined, but no explicit contract targets.

2. **Generic Target Configuration**: There was only a single generic `[[target.starknet-contract]]` entry without specific paths.

3. **Build Process Gap**: This configuration caused Scarb to not properly recognize individual contract files for compilation.

## Solution
The fix involves updating the Scarb.toml file to explicitly list each contract:

```toml
# Main contract target configuration
[[target.starknet-contract]]
sierra = true
casm = true

# Explicit contract targets
[[target.starknet-contract]]
name = "prophecy_sunya_prediction"
path = "contracts/prediction/src/prediction_contract.cairo"
sierra = true
casm = true

[[target.starknet-contract]]
name = "prophecy_sunya_nft"
path = "contracts/nft/src/nft_contract.cairo"
sierra = true
casm = true

# ... other contracts similarly defined
```

This configuration:
1. Maintains the original generic target for backward compatibility
2. Adds explicit targets for each contract with specific paths
3. Names each contract with a consistent prefix for easier identification
4. Ensures both Sierra and CASM outputs are generated

## Verification
The fix can be verified by:
1. Running `scarb build` and checking that contract artifacts are generated
2. Examining the `prophecy_sunya.starknet_artifacts.json` file to confirm it contains contracts
3. Deploying the contracts and confirming successful deployment

## Best Practices for Scarb Configuration
1. Always explicitly list contract targets with their paths
2. Use consistent naming conventions for contracts
3. Specify output formats (sierra, casm) for each contract
4. Maintain workspace members for proper dependency resolution
5. Verify build outputs after configuration changes

## Additional Recommendations
1. Add a pre-build validation step to verify Scarb.toml configuration
2. Document expected contract names and paths in the repository
3. Consider adding a script to automatically validate the build outputs
4. Implement CI checks to ensure artifacts are properly generated
