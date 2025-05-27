# Docker Compose Volume Mount Fix

## Issue
After implementing the multi-stage build fix in Dockerfile.deployer, the deployment was still failing with the same error:
```
Error deploying contract prophecy_sunya_prediction: Error: Could not find compiled_contract_class file for contract "prophecy_sunya_prediction". Check if your contract name is correct and build output location.
```

## Root Cause Analysis
The issue was caused by the volume mounts in the docker-compose.unified.yml file:
```yaml
volumes:
  - ./deployments:/app/deployments
  - ./target:/app/target  # This was the problem
```

When Docker mounts a volume from the host to the container, it **replaces** whatever is in the container's directory with the contents of the host directory. Since the local `./target` directory on the host was empty or non-existent, it was overriding the container's `/app/target` directory that contained the built contract artifacts.

This effectively erased all the contract artifacts that were built during the Docker image build process, making them unavailable to the deployment script.

## Solution
The fix involves:

1. Removing the problematic volume mounts for the `target` directory from both the contract-deployer and frontend services in docker-compose.unified.yml:
```yaml
# Before (problematic)
volumes:
  - ./deployments:/app/deployments
  - ./target:/app/target  # This was causing the issue

# After (fixed)
volumes:
  - ./deployments:/app/deployments
  # Target volume mount removed
```

2. Keeping the multi-stage build in Dockerfile.deployer to ensure contract artifacts are properly built and copied to the runtime environment.

## Why This Works
By removing the volume mount, we allow the container to use its internal `/app/target` directory, which contains the contract artifacts built during the Docker image build process. The deployment script can now find the compiled contract files and successfully deploy the contracts.

## Best Practices for Docker Volumes
When using Docker volumes:
1. Be careful when mounting volumes that might override important container directories
2. Consider using named volumes instead of host mounts for persistent data
3. Use read-only mounts (`:ro`) when the container doesn't need to modify the data
4. Document volume mounts clearly to avoid confusion

## Verification
The fix has been tested by:
1. Updating the docker-compose.unified.yml file
2. Rebuilding and running the Docker Compose stack
3. Verifying that the contract deployment succeeds

## Additional Recommendations
1. Add comments in the docker-compose.yml files explaining the purpose of each volume mount
2. Consider implementing a pre-deployment check that verifies the existence of required artifacts
3. Update CI/CD pipelines to include this fix
4. Document this issue and solution in your project's troubleshooting guide
