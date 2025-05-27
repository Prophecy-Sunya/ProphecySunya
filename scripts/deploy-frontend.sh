#!/bin/bash
set -e

# Configuration
ENVIRONMENT=${1:-"staging"}  # Default to staging if not specified
NETWORK=${2:-"testnet"}      # Default to testnet if not specified

# Check if deployment addresses exist
if [ ! -f "deployments/${NETWORK}_latest.json" ]; then
  echo "Error: Deployment addresses not found for network: $NETWORK"
  echo "Please deploy contracts first using ./scripts/deploy-contracts.sh $NETWORK"
  exit 1
fi

# Copy deployment addresses to frontend
echo "Copying contract addresses to frontend..."
mkdir -p frontend/src/config
cp deployments/${NETWORK}_latest.json frontend/src/config/contracts.json

# Install dependencies
echo "Installing frontend dependencies..."
cd frontend
pnpm install

# Run linting and type checking
echo "Running linting and type checking..."
pnpm lint
pnpm type-check

# Build frontend
echo "Building frontend for $ENVIRONMENT environment..."
NEXT_PUBLIC_ENVIRONMENT=$ENVIRONMENT \
NEXT_PUBLIC_NETWORK=$NETWORK \
pnpm build

# Deploy based on environment
if [ "$ENVIRONMENT" = "production" ]; then
  echo "Deploying to production..."
  # For Vercel deployment
  vercel --prod
elif [ "$ENVIRONMENT" = "staging" ]; then
  echo "Deploying to staging..."
  # For Vercel deployment
  vercel
else
  echo "Starting local server..."
  pnpm start
fi

echo "Frontend deployment completed!"
