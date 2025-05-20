# ProphecySunya - Sepolia Testnet Deployment Guide

## Overview

This guide explains how to deploy and run the ProphecySunya platform on the Sepolia testnet. The setup includes:

1. Next.js frontend configured for Sepolia testnet
2. Smart contracts deployed on Sepolia testnet
3. Integration with Starknet wallets (Argent X, Braavos)

## Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)
- Starknet wallet with Sepolia ETH for transaction fees

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/mrarejimmyz/ProphecySunya.git
cd ProphecySunya
```

2. Start the frontend with Docker Compose:
```bash
docker-compose up
```

3. Access the application:
   - Frontend: http://localhost:3000

The application is already configured with your Infura API key for Sepolia testnet.

## Contract Deployment on Sepolia

To deploy the contracts to Sepolia testnet:

1. Install Starkli or another Starknet deployment tool
2. Ensure you have a funded account on Sepolia testnet
3. Declare and deploy each contract:
```bash
starkli declare --network sepolia --account <YOUR_ACCOUNT> --watch contracts/prediction/target/dev/prediction_contract.sierra.json
starkli deploy --network sepolia --account <YOUR_ACCOUNT> --watch <CLASS_HASH>
```

4. Update the contract addresses in your `.env.local` file or docker-compose.yml

## Connecting to Sepolia

The application is configured to automatically connect to Sepolia testnet using your Infura API key. Make sure:

1. Your wallet (Argent X or Braavos) is set to Sepolia testnet
2. You have Sepolia ETH in your wallet for transaction fees

## Troubleshooting

- If transactions fail, ensure you have enough Sepolia ETH in your wallet
- If contract interactions fail, verify the contract addresses in the environment variables

## Architecture

The Docker Compose setup creates one service:

1. **frontend**: Next.js application that connects to Sepolia testnet

All configuration is handled through environment variables in the docker-compose.yml file, which is already set up with your Infura API key.

## API Key Security

Your Infura API key (0d3e154c01d243f3be0e42d3b861bc9e) is configured in the docker-compose.yml file. For production deployments, consider:

1. Using environment variables instead of hardcoding the key
2. Setting up rate limiting and monitoring on your Infura dashboard
3. Restricting domain access in your Infura settings
