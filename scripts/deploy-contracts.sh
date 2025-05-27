#!/bin/bash
set -e

# Configuration
NETWORK=${1:-"devnet"}  # Default to devnet if not specified
ACCOUNT=${2:-"my_account"}

# Ensure contracts are built before deployment
echo "Building contracts with Scarb..."
scarb build

# Verify build output
if [ ! -d "./target" ]; then
  echo "Error: Build failed, target directory not found."
  exit 1
fi

echo "Build successful. Checking for compiled contract artifacts..."
find ./target -name "*.json" | grep -E "compiled_contract_class|contract_class"

# Deploy contracts
echo "Deploying contracts to $NETWORK..."

# Deploy Prediction Contract
echo "Deploying Prediction Contract..."
PREDICTION_RESULT=$(sncast --account $ACCOUNT deploy --network $NETWORK --class-hash $(find ./target -name "prophecy_sunya_prediction.contract_class.json" -exec sncast declare --network $NETWORK --contract-name prophecy_sunya_prediction \;))
PREDICTION_ADDRESS=$(echo "$PREDICTION_RESULT" | grep "contract_address" | awk '{print $2}')
echo "Prediction Contract deployed at: $PREDICTION_ADDRESS"

# Deploy NFT Contract
echo "Deploying NFT Contract..."
NFT_RESULT=$(sncast --account $ACCOUNT deploy --network $NETWORK --class-hash $(find ./target -name "prophecy_sunya_nft.contract_class.json" -exec sncast declare --network $NETWORK --contract-name prophecy_sunya_nft \;))
NFT_ADDRESS=$(echo "$NFT_RESULT" | grep "contract_address" | awk '{print $2}')
echo "NFT Contract deployed at: $NFT_ADDRESS"

# Deploy Oracle Contract
echo "Deploying Oracle Contract..."
ORACLE_RESULT=$(sncast --account $ACCOUNT deploy --network $NETWORK --class-hash $(find ./target -name "prophecy_sunya_oracle.contract_class.json" -exec sncast declare --network $NETWORK --contract-name prophecy_sunya_oracle \;))
ORACLE_ADDRESS=$(echo "$ORACLE_RESULT" | grep "contract_address" | awk '{print $2}')
echo "Oracle Contract deployed at: $ORACLE_ADDRESS"

# Deploy Gas Tank Contract
echo "Deploying Gas Tank Contract..."
GAS_TANK_RESULT=$(sncast --account $ACCOUNT deploy --network $NETWORK --class-hash $(find ./target -name "prophecy_sunya_gas_tank.contract_class.json" -exec sncast declare --network $NETWORK --contract-name prophecy_sunya_gas_tank \;))
GAS_TANK_ADDRESS=$(echo "$GAS_TANK_RESULT" | grep "contract_address" | awk '{print $2}')
echo "Gas Tank Contract deployed at: $GAS_TANK_ADDRESS"

# Deploy Governance Contract
echo "Deploying Governance Contract..."
GOVERNANCE_RESULT=$(sncast --account $ACCOUNT deploy --network $NETWORK --class-hash $(find ./target -name "prophecy_sunya_governance.contract_class.json" -exec sncast declare --network $NETWORK --contract-name prophecy_sunya_governance \;))
GOVERNANCE_ADDRESS=$(echo "$GOVERNANCE_RESULT" | grep "contract_address" | awk '{print $2}')
echo "Governance Contract deployed at: $GOVERNANCE_ADDRESS"

# Deploy Bridge Contract
echo "Deploying Bridge Contract..."
BRIDGE_RESULT=$(sncast --account $ACCOUNT deploy --network $NETWORK --class-hash $(find ./target -name "prophecy_sunya_bridge.contract_class.json" -exec sncast declare --network $NETWORK --contract-name prophecy_sunya_bridge \;))
BRIDGE_ADDRESS=$(echo "$BRIDGE_RESULT" | grep "contract_address" | awk '{print $2}')
echo "Bridge Contract deployed at: $BRIDGE_ADDRESS"

# Save deployment addresses
mkdir -p deployments
cat > deployments/${NETWORK}_latest.json << EOF
{
  "prediction": {
    "address": "$PREDICTION_ADDRESS"
  },
  "nft": {
    "address": "$NFT_ADDRESS"
  },
  "oracle": {
    "address": "$ORACLE_ADDRESS"
  },
  "gas_tank": {
    "address": "$GAS_TANK_ADDRESS"
  },
  "governance": {
    "address": "$GOVERNANCE_ADDRESS"
  },
  "bridge": {
    "address": "$BRIDGE_ADDRESS"
  },
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo "Deployment completed successfully!"
echo "Deployment addresses saved to deployments/${NETWORK}_latest.json"
