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
echo "Declaring Prediction Contract..."
PREDICTION_CLASS_HASH=$(starkli declare --account devnet-account --rpc http://starknet-devnet:5050 --casm-hash ${PREDICTION_CLASS_HASH:-0x123456} target/dev/prophecy_sunya_prediction.sierra.json | grep -oP 'class hash: \K0x[0-9a-fA-F]+')
echo "Prediction Contract declared with class hash: $PREDICTION_CLASS_HASH"

echo "Deploying Prediction Contract instance..."
PREDICTION_ADDRESS=$(starkli deploy --account devnet-account --rpc http://starknet-devnet:5050 --salt 123 $PREDICTION_CLASS_HASH | grep -oP 'Contract address: \K0x[0-9a-fA-F]+')
echo "Prediction Contract deployed at: $PREDICTION_ADDRESS"

# Deploy NFT Contract
echo "Declaring NFT Contract..."
NFT_CLASS_HASH=$(starkli declare --account devnet-account --rpc http://starknet-devnet:5050 --casm-hash ${NFT_CLASS_HASH:-0x234567} target/dev/prophecy_sunya_nft.sierra.json | grep -oP 'class hash: \K0x[0-9a-fA-F]+')
echo "NFT Contract declared with class hash: $NFT_CLASS_HASH"

echo "Deploying NFT Contract instance..."
NFT_ADDRESS=$(starkli deploy --account devnet-account --rpc http://starknet-devnet:5050 --salt 456 $NFT_CLASS_HASH | grep -oP 'Contract address: \K0x[0-9a-fA-F]+')
echo "NFT Contract deployed at: $NFT_ADDRESS"

# Deploy Gas Tank Contract
echo "Declaring Gas Tank Contract..."
GAS_TANK_CLASS_HASH=$(starkli declare --account devnet-account --rpc http://starknet-devnet:5050 --casm-hash ${GAS_TANK_CLASS_HASH:-0x345678} target/dev/prophecy_sunya_gas_tank.sierra.json | grep -oP 'class hash: \K0x[0-9a-fA-F]+')
echo "Gas Tank Contract declared with class hash: $GAS_TANK_CLASS_HASH"

echo "Deploying Gas Tank Contract instance..."
GAS_TANK_ADDRESS=$(starkli deploy --account devnet-account --rpc http://starknet-devnet:5050 --salt 789 $GAS_TANK_CLASS_HASH | grep -oP 'Contract address: \K0x[0-9a-fA-F]+')
echo "Gas Tank Contract deployed at: $GAS_TANK_ADDRESS"

# Deploy Oracle Contract
echo "Declaring Oracle Contract..."
ORACLE_CLASS_HASH=$(starkli declare --account devnet-account --rpc http://starknet-devnet:5050 --casm-hash ${ORACLE_CLASS_HASH:-0x456789} target/dev/prophecy_sunya_oracle.sierra.json | grep -oP 'class hash: \K0x[0-9a-fA-F]+')
echo "Oracle Contract declared with class hash: $ORACLE_CLASS_HASH"

echo "Deploying Oracle Contract instance..."
ORACLE_ADDRESS=$(starkli deploy --account devnet-account --rpc http://starknet-devnet:5050 --salt 101112 $ORACLE_CLASS_HASH | grep -oP 'Contract address: \K0x[0-9a-fA-F]+')
echo "Oracle Contract deployed at: $ORACLE_ADDRESS"

# Deploy Governance Contract
echo "Declaring Governance Contract..."
GOVERNANCE_CLASS_HASH=$(starkli declare --account devnet-account --rpc http://starknet-devnet:5050 --casm-hash ${GOVERNANCE_CLASS_HASH:-0x567890} target/dev/prophecy_sunya_governance.sierra.json | grep -oP 'class hash: \K0x[0-9a-fA-F]+')
echo "Governance Contract declared with class hash: $GOVERNANCE_CLASS_HASH"

echo "Deploying Governance Contract instance..."
GOVERNANCE_ADDRESS=$(starkli deploy --account devnet-account --rpc http://starknet-devnet:5050 --salt 131415 $GOVERNANCE_CLASS_HASH | grep -oP 'Contract address: \K0x[0-9a-fA-F]+')
echo "Governance Contract deployed at: $GOVERNANCE_ADDRESS"

# Deploy Bridge Contract
echo "Declaring Bridge Contract..."
BRIDGE_CLASS_HASH=$(starkli declare --account devnet-account --rpc http://starknet-devnet:5050 --casm-hash ${BRIDGE_CLASS_HASH:-0x678901} target/dev/prophecy_sunya_bridge.sierra.json | grep -oP 'class hash: \K0x[0-9a-fA-F]+')
echo "Bridge Contract declared with class hash: $BRIDGE_CLASS_HASH"

echo "Deploying Bridge Contract instance..."
BRIDGE_ADDRESS=$(starkli deploy --account devnet-account --rpc http://starknet-devnet:5050 --salt 161718 $BRIDGE_CLASS_HASH | grep -oP 'Contract address: \K0x[0-9a-fA-F]+')
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
