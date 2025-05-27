# Scarb Artifact Structure Fix

## Issue
After fixing the Docker deployment issues, the deployment was still failing with the same error:
```
Error deploying contract prophecy_sunya_prediction: Error: Could not find compiled_contract_class file for contract "prophecy_sunya_prediction". Check if your contract name is correct and build output location.
```

## Root Cause Analysis
The issue was a mismatch between how Scarb generates build artifacts and what the deployment script expected:

1. **Scarb Build Output**: Scarb generates a single `prophecy_sunya.starknet_artifacts.json` file in the `/app/target/dev` directory that contains all contracts' compiled code.

2. **Deployment Script Expectation**: The script was looking for individual files like `prophecy_sunya_prediction.compiled_contract_class.json` for each contract.

This mismatch occurs because the Scarb.toml configuration defines a single package named "prophecy_sunya" with multiple workspace members, but doesn't generate separate artifact files for each contract.

## Solution
The fix involves updating the deployment script to work with Scarb's actual artifact structure:

1. Find and parse the `prophecy_sunya.starknet_artifacts.json` file
2. Extract the relevant contract data for each contract type (prediction, nft, etc.)
3. Use the extracted data for deployment

### Key Changes:
- Added a new `findStarknetArtifacts()` function to locate and parse the starknet_artifacts.json file
- Updated the `deployContract()` function to extract contract data from the artifacts based on contract type
- Improved error handling and debugging output
- Removed the old file search logic that was looking for non-existent files

## Verification
The fix has been tested by:
1. Verifying that the script can find and parse the starknet_artifacts.json file
2. Confirming that contract data can be extracted for each contract type
3. Successfully deploying all contracts

## Best Practices for Scarb Projects
1. Understand how Scarb generates artifacts for workspace projects
2. Align deployment scripts with the actual artifact structure
3. Use proper error handling and debugging to identify artifact issues
4. Consider using Scarb's native deployment tools when available

## Additional Recommendations
1. Add explicit documentation about the artifact structure in your project
2. Consider adding a pre-deployment validation step to verify artifacts
3. Update CI/CD pipelines to include this fix
4. Add more robust error handling for artifact parsing
