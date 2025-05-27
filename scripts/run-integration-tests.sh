#!/bin/bash
set -e

# Configuration
NETWORK=${1:-"testnet"}  # Default to testnet if not specified
ENVIRONMENT=${2:-"staging"}  # Default to staging if not specified

# Check if deployment was successful
if [ ! -f "deployments/${NETWORK}_latest.json" ]; then
  echo "Error: Deployment file not found for network: $NETWORK"
  echo "Please run the deployment first using ./scripts/deploy-contracts.sh $NETWORK"
  exit 1
fi

# Create integration test directory
mkdir -p tests/integration

# Write integration test for Prediction Contract
cat > tests/integration/test_prediction_contract.py << EOF
import json
import os
from starknet_py.net.gateway_client import GatewayClient
from starknet_py.net.networks import TESTNET, MAINNET
from starknet_py.contract import Contract

# Load deployment addresses
network = os.environ.get('NETWORK', 'testnet')
with open(f'deployments/{network}_latest.json', 'r') as f:
    deployment = json.load(f)

# Set up network
if network == 'mainnet':
    client = GatewayClient(MAINNET)
else:
    client = GatewayClient(TESTNET)

async def test_prediction_contract():
    # Load prediction contract
    prediction_address = deployment['prediction']['address']
    
    # Connect to contract
    prediction_contract = await Contract.from_address(prediction_address, client)
    
    # Test contract functions
    # Note: In a real test, you would call actual contract functions
    print(f"Successfully connected to Prediction Contract at {prediction_address}")
    
    return True

if __name__ == "__main__":
    import asyncio
    result = asyncio.run(test_prediction_contract())
    print(f"Test result: {'PASS' if result else 'FAIL'}")
    exit(0 if result else 1)
EOF

# Write integration test for NFT Contract
cat > tests/integration/test_nft_contract.py << EOF
import json
import os
from starknet_py.net.gateway_client import GatewayClient
from starknet_py.net.networks import TESTNET, MAINNET
from starknet_py.contract import Contract

# Load deployment addresses
network = os.environ.get('NETWORK', 'testnet')
with open(f'deployments/{network}_latest.json', 'r') as f:
    deployment = json.load(f)

# Set up network
if network == 'mainnet':
    client = GatewayClient(MAINNET)
else:
    client = GatewayClient(TESTNET)

async def test_nft_contract():
    # Load NFT contract
    nft_address = deployment['nft']['address']
    
    # Connect to contract
    nft_contract = await Contract.from_address(nft_address, client)
    
    # Test contract functions
    # Note: In a real test, you would call actual contract functions
    print(f"Successfully connected to NFT Contract at {nft_address}")
    
    return True

if __name__ == "__main__":
    import asyncio
    result = asyncio.run(test_nft_contract())
    print(f"Test result: {'PASS' if result else 'FAIL'}")
    exit(0 if result else 1)
EOF

# Write frontend integration test
cat > tests/integration/test_frontend_integration.js << EOF
const axios = require('axios');
const fs = require('fs');

// Load deployment addresses
const network = process.env.NETWORK || 'testnet';
const environment = process.env.ENVIRONMENT || 'staging';
const deployment = JSON.parse(fs.readFileSync(\`deployments/\${network}_latest.json\`, 'utf8'));

// Frontend URL based on environment
let frontendUrl;
if (environment === 'production') {
  frontendUrl = 'https://prophecy-sunya.vercel.app';
} else if (environment === 'staging') {
  frontendUrl = 'https://staging-prophecy-sunya.vercel.app';
} else {
  frontendUrl = 'http://localhost:3000';
}

async function testFrontendIntegration() {
  try {
    // Test frontend is accessible
    const response = await axios.get(frontendUrl);
    console.log(\`Frontend is accessible at \${frontendUrl}\`);
    
    // In a real test, you would test API endpoints and functionality
    
    return true;
  } catch (error) {
    console.error(\`Error testing frontend: \${error.message}\`);
    return false;
  }
}

testFrontendIntegration()
  .then(result => {
    console.log(\`Test result: \${result ? 'PASS' : 'FAIL'}\`);
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error(\`Test failed with error: \${error.message}\`);
    process.exit(1);
  });
EOF

# Run integration tests
echo "Running integration tests for $NETWORK deployment in $ENVIRONMENT environment..."

# Set environment variables for tests
export NETWORK=$NETWORK
export ENVIRONMENT=$ENVIRONMENT

# Run contract tests
echo "Testing Prediction Contract..."
python3 tests/integration/test_prediction_contract.py

echo "Testing NFT Contract..."
python3 tests/integration/test_nft_contract.py

# Run frontend tests if Node.js is available
if command -v node &> /dev/null; then
  echo "Testing Frontend Integration..."
  node tests/integration/test_frontend_integration.js
else
  echo "Node.js not found, skipping frontend integration tests."
fi

echo "Integration tests completed successfully!"
