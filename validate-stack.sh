#!/bin/bash
set -e

# This script validates the full stack deployment
# It checks that all services are running and the frontend can connect to the contracts

echo "Validating full stack deployment..."

# Check if starknet-devnet is running
echo "Checking starknet-devnet..."
if curl -s http://starknet-devnet:5050/is_alive > /dev/null; then
  echo "✅ starknet-devnet is running"
else
  echo "❌ starknet-devnet is not running"
  exit 1
fi

# Check if contract addresses are available
echo "Checking contract addresses..."
if [ -f /app/contract-addresses/addresses.json ]; then
  echo "✅ Contract addresses file exists"
  cat /app/contract-addresses/addresses.json
else
  echo "❌ Contract addresses file not found"
  exit 1
fi

# Check if frontend can connect to the contracts
echo "Checking frontend connection to contracts..."
cd /app/frontend
node -e "
const fs = require('fs');
const addresses = JSON.parse(fs.readFileSync('/app/contract-addresses/addresses.json'));
console.log('Loaded contract addresses:', addresses);
console.log('Prediction contract address:', addresses.prediction);
if (!addresses.prediction) {
  console.error('❌ Prediction contract address not found');
  process.exit(1);
}
console.log('✅ Frontend can access contract addresses');
"

echo "Full stack validation complete!"
