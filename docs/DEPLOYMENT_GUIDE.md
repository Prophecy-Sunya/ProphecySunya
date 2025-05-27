# ProphecySunya Deployment Guide

This guide provides comprehensive instructions for deploying the ProphecySunya platform to production. It includes all necessary steps, from environment setup to contract deployment, frontend deployment, and monitoring.

## Prerequisites

- Node.js 20.x or later
- pnpm 8.x or later
- Scarb (Cairo package manager)
- Starknet Foundry
- Starkli
- Python 3.8+ with starknet-py
- Access to a Starknet node (or use a service like Infura)
- Starknet wallet with sufficient funds for deployment

## 1. Environment Setup

### Install Required Tools

```bash
# Install Scarb (Cairo package manager)
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh

# Install Starknet Foundry
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh

# Install starkli for contract interaction
curl https://get.starkli.sh | sh

# Install Node.js and pnpm
# (Use your preferred method for Node.js installation)
npm install -g pnpm
```

### Configure Environment Variables

Create a `.env` file in the project root:

```
# Starknet Configuration
STARKNET_NETWORK=testnet  # or mainnet for production
STARKNET_ACCOUNT=my_account
STARKNET_NODE_URL=https://your-starknet-node-url

# Frontend Configuration
NEXT_PUBLIC_STARKNET_NETWORK=testnet  # or mainnet for production
NEXT_PUBLIC_STARKNET_NODE_URL=https://your-starknet-node-url
```

## 2. Deployment Process

### Step 1: Test in a Local Environment

Before deploying to testnet or mainnet, test the deployment process locally:

```bash
# Run the test deployment script
./scripts/test-deployment.sh devnet
```

This script will:
- Start a local Starknet node
- Deploy all contracts
- Deploy the frontend locally
- Run basic integration tests

### Step 2: Deploy to Testnet

Once local testing is successful, deploy to testnet:

```bash
# Deploy contracts to testnet
./scripts/deploy-contracts.sh testnet your_account_name

# Deploy frontend to staging
./scripts/deploy-frontend.sh staging testnet
```

### Step 3: Run Integration Tests

Verify the testnet deployment with integration tests:

```bash
# Run integration tests against testnet deployment
./scripts/run-integration-tests.sh testnet staging
```

### Step 4: Deploy to Mainnet

After successful testnet validation, deploy to mainnet:

```bash
# Deploy contracts to mainnet
./scripts/deploy-contracts.sh mainnet your_account_name

# Deploy frontend to production
./scripts/deploy-frontend.sh production mainnet
```

### Step 5: Verify Production Deployment

Run integration tests against the production deployment:

```bash
# Run integration tests against mainnet deployment
./scripts/run-integration-tests.sh mainnet production
```

## 3. Contract Addresses Management

After deployment, contract addresses are saved in the `deployments` directory:

- Testnet: `deployments/testnet_latest.json`
- Mainnet: `deployments/mainnet_latest.json`

These files are automatically used by the frontend deployment script to configure the frontend with the correct contract addresses.

## 4. Security Considerations

### Access Control

- The owner account has full administrative privileges
- Add additional admin accounts for operational security
- Grant specific roles (ORACLE_ROLE, VERIFIER_ROLE) to service accounts

Example:

```bash
# Using starkli to add an admin
starkli invoke --account your_account_name --network mainnet $PREDICTION_ADDRESS add_admin $NEW_ADMIN_ADDRESS
```

### Key Management

- Use a hardware wallet for the owner account
- Use separate accounts for different environments (testnet, mainnet)
- Implement proper key rotation procedures

### Monitoring

- Set up monitoring for contract events
- Monitor gas usage and transaction costs
- Set up alerts for critical events

## 5. Maintenance and Updates

### Contract Updates

For contract updates:

1. Implement and test changes locally
2. Deploy updated contracts to testnet
3. Run integration tests
4. Deploy to mainnet
5. Update frontend configuration

### Frontend Updates

For frontend updates:

1. Implement and test changes locally
2. Deploy to staging environment
3. Run integration tests
4. Deploy to production

## 6. Troubleshooting

### Common Issues

1. **Contract deployment fails**
   - Ensure you have sufficient funds in your wallet
   - Check that contract artifacts are built correctly
   - Verify network configuration

2. **Frontend deployment fails**
   - Check that contract addresses are correctly configured
   - Verify environment variables are set correctly
   - Check build logs for errors

3. **Transaction errors**
   - Check gas settings
   - Verify contract addresses
   - Check input parameters

## 7. Contact and Support

For additional support, contact the ProphecySunya team at:
- Email: support@prophecysunya.com
- Discord: https://discord.gg/prophecysunya
