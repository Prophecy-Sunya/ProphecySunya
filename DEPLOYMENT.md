# ProphecySunya - Docker Compose Deployment Guide

## Overview

This guide explains how to deploy and run the entire ProphecySunya platform using Docker Compose. The setup includes:

1. Starknet Devnet for local blockchain
2. Automatic contract deployment
3. Next.js frontend application

## Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/mrarejimmyz/ProphecySunya.git
cd ProphecySunya
```

2. Make the deploy-contracts.sh script executable:
```bash
chmod +x deploy-contracts.sh
```

3. Start the entire stack with one command:
```bash
docker-compose up
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Starknet Devnet: http://localhost:5050

5. To stop all services:
```bash
docker-compose down
```

## What Happens During Startup

1. **Starknet Devnet** starts and initializes a local Starknet blockchain
2. **Contract Deployer** automatically deploys all smart contracts to Devnet
3. **Next.js Frontend** starts and connects to the deployed contracts

## Viewing Logs

To see logs from all services:
```bash
docker-compose logs -f
```

To see logs from a specific service:
```bash
docker-compose logs -f frontend
docker-compose logs -f starknet-devnet
docker-compose logs -f contract-deployer
```

## Development Workflow

1. Make changes to the contracts in the `contracts/` directory
2. Make changes to the frontend in the `frontend/` directory
3. Restart the stack with `docker-compose down && docker-compose up`

## Troubleshooting

- If the frontend can't connect to contracts, check the contract-deployer logs
- If Devnet isn't responding, restart the stack with `docker-compose down && docker-compose up`
- For persistent issues, try rebuilding with `docker-compose build --no-cache`

## Architecture

The Docker Compose setup creates three services:

1. **starknet-devnet**: Local Starknet blockchain for development
2. **contract-deployer**: Deploys all contracts to Devnet and saves addresses
3. **frontend**: Next.js application that connects to the deployed contracts

All services are configured to work together seamlessly with proper dependency management and health checks.
