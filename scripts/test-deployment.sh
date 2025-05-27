#!/bin/bash
set -e

# Configuration
NETWORK=${1:-"devnet"}  # Default to devnet if not specified

# Check if deployment scripts exist
if [ ! -f "scripts/deploy-contracts.sh" ]; then
  echo "Error: Deployment script not found: scripts/deploy-contracts.sh"
  exit 1
fi

if [ ! -f "scripts/deploy-frontend.sh" ]; then
  echo "Error: Deployment script not found: scripts/deploy-frontend.sh"
  exit 1
fi

# Make scripts executable
chmod +x scripts/deploy-contracts.sh
chmod +x scripts/deploy-frontend.sh

# Create test environment
echo "Setting up test environment for $NETWORK..."

# Start local Starknet node if using devnet
if [ "$NETWORK" = "devnet" ]; then
  echo "Starting local Starknet node..."
  # Check if starknet-devnet is installed
  if ! command -v starknet-devnet &> /dev/null; then
    echo "starknet-devnet not found, installing..."
    pip install starknet-devnet
  fi
  
  # Start devnet in background
  starknet-devnet --seed 42 &
  DEVNET_PID=$!
  
  # Wait for devnet to start
  echo "Waiting for devnet to start..."
  sleep 5
  
  echo "Devnet started with PID: $DEVNET_PID"
fi

# Deploy contracts
echo "Deploying contracts to $NETWORK..."
./scripts/deploy-contracts.sh $NETWORK

# Verify contract deployment
if [ ! -f "deployments/${NETWORK}_latest.json" ]; then
  echo "Error: Contract deployment failed, deployment file not found."
  
  # Cleanup devnet if running
  if [ "$NETWORK" = "devnet" ] && [ ! -z "$DEVNET_PID" ]; then
    echo "Stopping devnet..."
    kill $DEVNET_PID
  fi
  
  exit 1
fi

echo "Contract deployment successful!"

# Deploy frontend to local environment
echo "Deploying frontend to local environment..."
./scripts/deploy-frontend.sh local $NETWORK

# Run integration tests
echo "Running integration tests..."
# Add integration tests here

echo "End-to-end deployment test completed successfully!"

# Cleanup devnet if running
if [ "$NETWORK" = "devnet" ] && [ ! -z "$DEVNET_PID" ]; then
  echo "Stopping devnet..."
  kill $DEVNET_PID
fi
