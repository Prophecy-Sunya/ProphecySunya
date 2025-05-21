#!/bin/bash
set -e

# Wait for contract addresses file to be available
echo "Waiting for contract addresses to be available..."
while [ ! -f /app/contract-addresses/addresses.env ]; do
  echo "Contract addresses not yet available, waiting..."
  sleep 5
done

echo "Contract addresses found, loading environment variables..."

# Source the environment variables
source /app/contract-addresses/addresses.env

# Print the loaded addresses for debugging
echo "Loaded contract addresses:"
echo "PREDICTION: $NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS"
echo "NFT: $NEXT_PUBLIC_NFT_CONTRACT_ADDRESS"
echo "GAS TANK: $NEXT_PUBLIC_GAS_TANK_CONTRACT_ADDRESS"
echo "ORACLE: $NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS"
echo "GOVERNANCE: $NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS"
echo "BRIDGE: $NEXT_PUBLIC_BRIDGE_CONTRACT_ADDRESS"

# Export the variables so they're available to the Next.js process
export NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS
export NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
export NEXT_PUBLIC_GAS_TANK_CONTRACT_ADDRESS
export NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS
export NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS
export NEXT_PUBLIC_BRIDGE_CONTRACT_ADDRESS

echo "Environment variables exported successfully!"
