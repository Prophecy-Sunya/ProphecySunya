# Scarb Version Fix for ProphecySunya

## Issue Description

The deployment of ProphecySunya contracts was failing because the Docker container was using an outdated version of Scarb (v2.4.0), which was causing empty artifact files to be generated:

```json
{"version":1,"contracts":[]}
```

This prevented the deployment script from finding any contracts to deploy, resulting in the error:
```
Error deploying contract prediction: Error: Could not find contract for type "prediction" in artifacts
```

## Root Cause

1. **Scarb Version Mismatch**: The Dockerfile was using Scarb v2.4.0, which is significantly older than the current version (v2.11.4).

2. **Empty Artifact Files**: The older Scarb version was generating artifact files with empty contract arrays, making it impossible for the deployment script to find and deploy the contracts.

## Solution

The Scarb version in the Dockerfile has been updated from v2.4.0 to v2.11.4:

```diff
- ENV SCARB_VERSION=2.4.0
+ ENV SCARB_VERSION=2.11.4
```

This ensures that the Docker build process uses the same Scarb version that successfully compiles the contracts locally.

## Additional Recommendations

For complete resolution of all potential issues, consider also:

1. **Update Cairo Version in Scarb.toml**:
   ```toml
   # Update this line in Scarb.toml
   cairo-version = "2.4.0" -> "2.11.4"
   ```

2. **Fix Struct Field Mismatch**: There's a discrepancy in the `Verification` struct:
   - In types.cairo: Has `verification_time` field
   - In oracle_contract.cairo: Uses `timestamp` field

3. **Add Debug Output to Deployment Script**:
   ```typescript
   // Add to deploy.ts
   console.log("Artifact content:", JSON.stringify(artifactContent, null, 2));
   ```

## Rebuilding the Docker Container

To apply this fix, rebuild the Docker container with:

```bash
docker-compose -f docker-compose.unified.yml down
docker system prune -a --volumes
docker-compose -f docker-compose.unified.yml up --build
```

This will ensure that the container uses the updated Scarb version and generates proper contract artifacts.
