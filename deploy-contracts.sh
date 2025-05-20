#!/bin/bash
set -e

# Wait for Starknet Devnet to be fully ready
echo "Waiting for Starknet Devnet to be ready..."
until $(curl --output /dev/null --silent --fail http://starknet-devnet:5050/is_alive); do
    printf '.'
    sleep 2
done
echo "Starknet Devnet is ready!"

# Build the contracts
echo "Building contracts..."
cd /app
scarb build

# Deploy the contracts
echo "Deploying contracts to Devnet..."

# Deploy Prediction Contract
echo "Deploying Prediction Contract..."
PREDICTION_ADDRESS=$(starknet deploy --contract-address-salt 123 --class-hash 0x123456 --network devnet)
echo "Prediction Contract deployed at: $PREDICTION_ADDRESS"

# Deploy NFT Contract
echo "Deploying NFT Contract..."
NFT_ADDRESS=$(starknet deploy --contract-address-salt 456 --class-hash 0x234567 --network devnet)
echo "NFT Contract deployed at: $NFT_ADDRESS"

# Deploy Gas Tank Contract
echo "Deploying Gas Tank Contract..."
GAS_TANK_ADDRESS=$(starknet deploy --contract-address-salt 789 --class-hash 0x345678 --network devnet)
echo "Gas Tank Contract deployed at: $GAS_TANK_ADDRESS"

# Deploy Oracle Contract
echo "Deploying Oracle Contract..."
ORACLE_ADDRESS=$(starknet deploy --contract-address-salt 101112 --class-hash 0x456789 --network devnet)
echo "Oracle Contract deployed at: $ORACLE_ADDRESS"

# Deploy Governance Contract
echo "Deploying Governance Contract..."
GOVERNANCE_ADDRESS=$(starknet deploy --contract-address-salt 131415 --class-hash 0x567890 --network devnet)
echo "Governance Contract deployed at: $GOVERNANCE_ADDRESS"

# Deploy Bridge Contract
echo "Deploying Bridge Contract..."
BRIDGE_ADDRESS=$(starknet deploy --contract-address-salt 161718 --class-hash 0x678901 --network devnet)
echo "Bridge Contract deployed at: $BRIDGE_ADDRESS"

# Write contract addresses to a file that can be mounted to the frontend
echo "Writing contract addresses to file..."
cat > /app/contract-addresses.json << EOL
{
  "prediction": "$PREDICTION_ADDRESS",
  "nft": "$NFT_ADDRESS",
  "gasTank": "$GAS_TANK_ADDRESS",
  "oracle": "$ORACLE_ADDRESS",
  "governance": "$GOVERNANCE_ADDRESS",
  "bridge": "$BRIDGE_ADDRESS"
}
EOL

echo "All contracts deployed successfully!"
echo "Contract addresses saved to /app/contract-addresses.json"

# Keep the container running to maintain logs
tail -f /dev/null
