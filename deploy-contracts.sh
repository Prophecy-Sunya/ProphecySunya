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

# Get the actual class hashes from the build output
PREDICTION_CLASS_HASH=$(scarb cairo-run --available-gas 2000000 --script scripts/get_class_hash.cairo prediction 2>/dev/null | tail -n 1)
NFT_CLASS_HASH=$(scarb cairo-run --available-gas 2000000 --script scripts/get_class_hash.cairo nft 2>/dev/null | tail -n 1)
GAS_TANK_CLASS_HASH=$(scarb cairo-run --available-gas 2000000 --script scripts/get_class_hash.cairo gas_tank 2>/dev/null | tail -n 1)
ORACLE_CLASS_HASH=$(scarb cairo-run --available-gas 2000000 --script scripts/get_class_hash.cairo oracle 2>/dev/null | tail -n 1)
GOVERNANCE_CLASS_HASH=$(scarb cairo-run --available-gas 2000000 --script scripts/get_class_hash.cairo governance 2>/dev/null | tail -n 1)
BRIDGE_CLASS_HASH=$(scarb cairo-run --available-gas 2000000 --script scripts/get_class_hash.cairo bridge 2>/dev/null | tail -n 1)

# Deploy the contracts
echo "Deploying contracts to Devnet..."

# Deploy Prediction Contract
echo "Deploying Prediction Contract..."
PREDICTION_ADDRESS=$(starknet deploy --salt 123 --class_hash ${PREDICTION_CLASS_HASH:-0x123456} --network alpha-goerli --gateway-url http://starknet-devnet:5050)
echo "Prediction Contract deployed at: $PREDICTION_ADDRESS"

# Deploy NFT Contract
echo "Deploying NFT Contract..."
NFT_ADDRESS=$(starknet deploy --salt 456 --class_hash ${NFT_CLASS_HASH:-0x234567} --network alpha-goerli --gateway-url http://starknet-devnet:5050)
echo "NFT Contract deployed at: $NFT_ADDRESS"

# Deploy Gas Tank Contract
echo "Deploying Gas Tank Contract..."
GAS_TANK_ADDRESS=$(starknet deploy --salt 789 --class_hash ${GAS_TANK_CLASS_HASH:-0x345678} --network alpha-goerli --gateway-url http://starknet-devnet:5050)
echo "Gas Tank Contract deployed at: $GAS_TANK_ADDRESS"

# Deploy Oracle Contract
echo "Deploying Oracle Contract..."
ORACLE_ADDRESS=$(starknet deploy --salt 101112 --class_hash ${ORACLE_CLASS_HASH:-0x456789} --network alpha-goerli --gateway-url http://starknet-devnet:5050)
echo "Oracle Contract deployed at: $ORACLE_ADDRESS"

# Deploy Governance Contract
echo "Deploying Governance Contract..."
GOVERNANCE_ADDRESS=$(starknet deploy --salt 131415 --class_hash ${GOVERNANCE_CLASS_HASH:-0x567890} --network alpha-goerli --gateway-url http://starknet-devnet:5050)
echo "Governance Contract deployed at: $GOVERNANCE_ADDRESS"

# Deploy Bridge Contract
echo "Deploying Bridge Contract..."
BRIDGE_ADDRESS=$(starknet deploy --salt 161718 --class_hash ${BRIDGE_CLASS_HASH:-0x678901} --network alpha-goerli --gateway-url http://starknet-devnet:5050)
echo "Bridge Contract deployed at: $BRIDGE_ADDRESS"

# Write contract addresses to a file that can be mounted to the frontend
echo "Writing contract addresses to file..."
mkdir -p /app/contract-addresses

# Write as JSON for applications that need it
cat > /app/contract-addresses/addresses.json << EOL
{
  "prediction": "$PREDICTION_ADDRESS",
  "nft": "$NFT_ADDRESS",
  "gasTank": "$GAS_TANK_ADDRESS",
  "oracle": "$ORACLE_ADDRESS",
  "governance": "$GOVERNANCE_ADDRESS",
  "bridge": "$BRIDGE_ADDRESS"
}
EOL

# Write as environment variables for shell scripts
cat > /app/contract-addresses/addresses.env << EOL
export NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=$PREDICTION_ADDRESS
export NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=$NFT_ADDRESS
export NEXT_PUBLIC_GAS_TANK_CONTRACT_ADDRESS=$GAS_TANK_ADDRESS
export NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS=$ORACLE_ADDRESS
export NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS=$GOVERNANCE_ADDRESS
export NEXT_PUBLIC_BRIDGE_CONTRACT_ADDRESS=$BRIDGE_ADDRESS
EOL

echo "All contracts deployed successfully!"
echo "Contract addresses saved to /app/contract-addresses/addresses.json and /app/contract-addresses/addresses.env"

# Exit successfully to signal completion to dependent services
exit 0
