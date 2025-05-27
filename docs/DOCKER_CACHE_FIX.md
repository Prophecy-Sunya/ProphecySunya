# Docker Cache and Script Update Fix

## Issue
Despite multiple fixes to the deployment script, the Docker container was still using the old version of the script, resulting in the same error:
```
Error deploying contract prophecy_sunya_prediction: Error: Could not find compiled_contract_class file for contract "prophecy_sunya_prediction". Check if your contract name is correct and build output location.
```

## Root Cause Analysis
The issue was related to Docker's build cache and the order of operations in the Dockerfile:

1. **Docker Build Cache**: Docker was reusing cached layers that contained the old version of the deployment script, even after we updated the script in the repository.

2. **Dockerfile Structure**: The `COPY scripts/deploy.ts` instruction was placed before the final CMD, allowing Docker to use a cached layer with the old script.

## Solution
The fix involves two key changes:

1. **Move the script copy to the end of the Dockerfile**:
   ```dockerfile
   # IMPORTANT: Copy the deployment script at the very end to ensure the latest version is used
   # This prevents Docker cache issues from using an old version of the script
   COPY scripts/deploy.ts /app/scripts/
   ```

2. **Add a version identifier to the script**:
   ```typescript
   // DEPLOY SCRIPT VERSION 2.0 - ARTIFACT STRUCTURE FIX
   console.log("Running deployment script v2.0 with artifact structure fix");
   ```

3. **Force a complete rebuild**:
   ```bash
   docker-compose -f docker-compose.unified.yml down
   docker system prune -a --volumes
   docker-compose -f docker-compose.unified.yml up --build
   ```

## Why This Works
- Moving the script copy to the end of the Dockerfile ensures that even if other layers are cached, the script will always be the latest version.
- Adding a version identifier makes it easy to verify which script version is running in the container.
- Forcing a complete rebuild ensures no stale artifacts or cached layers are used.

## Best Practices for Docker Builds
1. Place frequently changing files at the end of Dockerfiles to minimize cache invalidation
2. Add version identifiers to scripts for easy runtime verification
3. Use build arguments or environment variables to force cache invalidation when needed
4. Regularly clean Docker cache with `docker system prune` to prevent stale artifacts
5. Use multi-stage builds to separate build and runtime environments

## Verification
The fix can be verified by:
1. Checking the container logs for the version identifier message
2. Confirming that the deployment succeeds without the previous error
3. Inspecting the container to ensure it contains the latest script

## Additional Recommendations
1. Add a CI/CD step to verify script versions at runtime
2. Consider using Docker BuildKit's improved caching mechanisms
3. Document Docker cache considerations in your project's deployment guide
4. Implement a pre-deployment validation step to verify script versions
