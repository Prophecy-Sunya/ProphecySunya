# ProphecySunya Full Stack Automation Guide

## Overview

This guide explains the changes made to automate the full stack deployment of ProphecySunya, ensuring that:
1. Contracts are automatically built and deployed
2. Contract addresses are extracted and made available to the frontend
3. The frontend is configured to use the deployed contracts

## Key Components

### 1. Docker Compose Setup

The `docker-compose.yml` has been updated to include:

- **Starknet Devnet**: A local Starknet development network
- **Contract Deployer**: A service that builds and deploys contracts
- **Frontend**: The Next.js application that connects to the deployed contracts

Services are configured with proper dependencies to ensure they start in the correct order.

### 2. Contract Deployment Automation

The `deploy-contracts.sh` script has been enhanced to:

- Wait for Devnet to be ready
- Build contracts using Scarb
- Extract class hashes from build artifacts
- Deploy contracts to Devnet
- Save contract addresses in both JSON and environment variable formats
- Exit properly to signal completion to dependent services

### 3. Frontend Integration

The `load-contract-addresses.sh` script ensures the frontend uses the deployed contracts by:

- Waiting for contract addresses to be available
- Loading environment variables from the shared volume
- Exporting them to the Next.js process

## How to Use

1. **Start the Stack**:
   ```bash
   docker-compose up
   ```

2. **Access the Frontend**:
   Open http://localhost:3000 in your browser

3. **Verify Deployment**:
   Run the validation script to confirm everything is working:
   ```bash
   docker-compose exec frontend /bin/bash /app/validate-stack.sh
   ```

## Deployment Flow

1. Starknet Devnet starts and becomes available
2. Contract Deployer builds and deploys contracts to Devnet
3. Contract addresses are saved to a shared volume
4. Frontend loads the contract addresses and starts
5. Frontend connects to the deployed contracts on Devnet

## Files Modified

1. `docker-compose.yml` - Updated with multi-service setup and dependencies
2. `deploy-contracts.sh` - Enhanced for reliable contract deployment
3. `load-contract-addresses.sh` (new) - Created to load contract addresses into frontend
4. `create-scripts.sh` (new) - Helper for class hash extraction
5. `validate-stack.sh` (new) - Validates the full stack deployment

## Production Deployment

For production deployment:

1. Update the Starknet network in docker-compose.yml:
   ```yaml
   environment:
     - NEXT_PUBLIC_STARKNET_NETWORK=mainnet
     - NEXT_PUBLIC_PROVIDER_URL=https://starknet-mainnet.infura.io/v3/YOUR_API_KEY
   ```

2. Modify deploy-contracts.sh to deploy to the production network instead of Devnet

3. Ensure proper account credentials are available for contract deployment

## Troubleshooting

- **Contracts not deploying**: Check Devnet logs with `docker-compose logs starknet-devnet`
- **Frontend can't find contracts**: Verify addresses with `docker-compose exec frontend cat /app/contract-addresses/addresses.json`
- **Contract interaction fails**: Ensure the frontend is using the correct network and provider URL
