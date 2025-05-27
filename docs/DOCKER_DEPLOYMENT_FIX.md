# Docker Deployment Fix Documentation

## Issue
The ProphecySunya deployment was failing with the following error:
```
Error deploying contract prophecy_sunya_prediction: Error: Could not find compiled_contract_class file for contract "prophecy_sunya_prediction". Check if your contract name is correct and build output location.
```

## Root Cause Analysis
After analyzing the Docker build and deployment pipeline, I identified that the contract artifacts built in the builder stage of the Dockerfile.deployer were not being copied to the runtime environment. This resulted in an empty `/app/target` directory in the final container, causing the deployment script to fail when looking for compiled contract files.

## Solution
The fix involves modifying the Dockerfile.deployer to use a multi-stage build approach:

1. First stage (builder): Build the Cairo contracts using Scarb
2. Second stage (runtime): Copy the built artifacts from the builder stage to the runtime environment

### Key Changes:
- Added a proper multi-stage build in Dockerfile.deployer
- Explicitly copied the `/app/target` directory from the builder stage to the runtime stage
- Added debug commands to verify the presence of contract artifacts before deployment
- Ensured the deployment script can find the compiled contract files

## Verification
The fix has been tested by:
1. Building the updated Docker image
2. Verifying that contract artifacts are present in the runtime container
3. Confirming successful contract deployment

## Additional Recommendations
1. Always use multi-stage builds for deployment pipelines to ensure artifacts are properly transferred
2. Add explicit debug steps in Docker entrypoints to verify critical files exist
3. Consider adding a pre-deployment validation step to check for required artifacts
4. Update CI/CD pipelines to include artifact verification tests
