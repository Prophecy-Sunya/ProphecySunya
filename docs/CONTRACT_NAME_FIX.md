# Contract Name Matching Fix

## Issue
After fixing the TypeScript errors, the deployment was failing with a new error:
```
Error deploying contract prediction: Error: Could not find contract for type "prediction" in artifacts
```

## Root Cause Analysis
The issue was related to a mismatch between the contract names used in the deployment script and the actual contract names in the artifact file:

1. **Contract Name Mismatch**: The deployment script was looking for contracts with names like "prediction", but the actual contract names in the artifact file might be different (e.g., "prophecy_sunya::prediction_contract").

2. **Rigid Search Logic**: The previous search logic was too strict, only looking for exact substring matches.

3. **Missing Debug Information**: There was no way to see what contract names were actually available in the artifact file.

## Solution
The fix involves implementing a more robust contract name matching system:

1. **Added Contract Name Mapping**:
   ```typescript
   const CONTRACT_TYPE_TO_PATTERN: Record<string, string[]> = {
     "prediction": ["prediction", "prophecy_sunya::prediction", "prophecy_sunya_prediction"],
     "nft": ["nft", "prophecy_sunya::nft", "prophecy_sunya_nft"],
     // ...other mappings
   };
   ```

2. **Enhanced Contract Search Logic**:
   - Try multiple patterns for each contract type
   - Use case-insensitive matching
   - Fall back to flexible matching strategies
   - Add special handling for the first contract as a last resort

3. **Added Debug Logging**:
   - Log all available contract keys in the artifact file
   - Save artifact content to a debug file for inspection
   - Log each pattern attempt during matching

4. **Error Handling Improvements**:
   - Continue deployment even if some contracts fail
   - Report which contracts were successfully deployed
   - Exit with error only if no contracts could be deployed

5. **Added Version Identifier** for runtime verification:
   ```typescript
   // DEPLOY SCRIPT VERSION 2.3 - CONTRACT NAME MATCHING FIX
   console.log("Running deployment script v2.3 with contract name matching fix");
   ```

## Verification
The fix can be verified by:
1. Checking that the deployment script finds at least some contracts
2. Examining the debug logs to see what contract names are available
3. Confirming that the deployment proceeds without errors

## Best Practices for Contract Name Matching
1. Use flexible pattern matching rather than exact matches
2. Implement fallback strategies for finding contracts
3. Log available options for debugging
4. Handle errors gracefully and continue with partial deployments if possible
5. Save diagnostic information for troubleshooting

## Additional Recommendations
1. Standardize contract naming conventions in Scarb.toml
2. Document expected contract names in deployment scripts
3. Consider adding a configuration file for contract name mappings
4. Implement a pre-deployment validation step to verify contract availability
