#!/bin/bash
# build-and-deploy.sh - Combined build and deployment script

set -e  # Exit on any error

echo "Starting build and deployment process..."

# Step 1: Build the contracts with Scarb
echo "Building contracts with Scarb..."
scarb build

# Step 2: Verify artifacts were generated
if [ ! -d "target/dev" ]; then
  echo "Error: Build failed to generate target/dev directory"
  exit 1
fi

# Check for specific artifacts
for contract in prediction_contract nft_contract gas_tank_contract oracle_contract governance_contract bridge_contract; do
  if [ ! -f "target/dev/prophecy_sunya_${contract}.sierra.json" ]; then
    echo "Error: Missing artifact for ${contract}"
    exit 1
  fi
done

echo "Build successful, artifacts generated."

# Step 3: Run the deployment script
echo "Starting deployment..."
cd scripts
npm install
npx ts-node deploy.ts

echo "Build and deployment process completed."
