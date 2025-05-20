# ProphecySunya Project Documentation

## Project Overview

ProphecySunya is a decentralized prediction market platform built on Starknet that integrates prediction markets with blockchain development tools through a modular, layered architecture. The platform allows users to create predictions, verify outcomes through AI oracles, mint NFTs for verified predictions, and participate in governance.

## Project Structure

The project consists of two main components:

1. **Smart Contract Backend**: Cairo contracts for core functionality
   - Prediction Contract: Manages prediction lifecycle
   - NFT Contract: Handles NFT minting and transfers for verified predictions
   - Gas Tank Contract: Provides transaction sponsorship and meta-transactions
   - Oracle Contract: Processes prediction verification
   - Governance Contract: Manages proposal creation and voting
   - Bridge Contract: Enables cross-chain prediction bridging

2. **Next.js Frontend**: Modern, responsive user interface
   - Integration with Starknet wallets (Argent X, Braavos)
   - Prediction creation and browsing
   - NFT minting and viewing
   - Governance participation
   - Cross-chain bridging interface

## Setup and Installation

### Prerequisites

- Node.js (v16+)
- Yarn or npm
- Scarb (for Cairo development)
- Starknet Devnet (for local testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/prophecy-sunya.git
cd prophecy-sunya
```

2. Install backend dependencies:
```bash
scarb install
```

3. Build the contracts:
```bash
scarb build
```

4. Install frontend dependencies:
```bash
cd frontend
yarn install
```

5. Start the development server:
```bash
yarn dev
```

## Docker Setup

The project includes a multi-stage Dockerfile that optimizes for both development and production environments.

### Building the Docker Image

```bash
docker build -t prophecy-sunya .
```

### Running the Docker Container

The Docker container supports multiple commands:

```bash
# To build the contracts
docker run prophecy-sunya build

# To run tests
docker run prophecy-sunya test

# To start Starknet Devnet
docker run -p 5050:5050 prophecy-sunya devnet

# To start the Next.js development server
docker run -p 3000:3000 prophecy-sunya frontend

# To build the Next.js production bundle
docker run prophecy-sunya frontend:build

# To start the Next.js production server
docker run -p 3000:3000 prophecy-sunya frontend:start

# To start both Devnet and Next.js dev server
docker run -p 5050:5050 -p 3000:3000 prophecy-sunya full-stack

# To get a shell in the container
docker run -it prophecy-sunya shell
```

## Project Components

### Smart Contracts

The smart contracts are written in Cairo 2.4.0 and are organized in a modular structure:

- **Prediction Contract**: Manages the creation, verification, and querying of predictions
- **NFT Contract**: Handles the minting, transfer, and management of NFTs for verified predictions
- **Gas Tank Contract**: Provides transaction sponsorship and meta-transactions for improved UX
- **Oracle Contract**: Processes prediction verification through AI oracles
- **Governance Contract**: Manages proposal creation, voting, and execution
- **Bridge Contract**: Enables cross-chain prediction bridging

### Frontend

The frontend is built with Next.js, TypeScript, and Material UI, providing a modern and responsive user interface:

- **Pages**: Home, Predictions, NFTs, Governance, About, FAQ
- **Components**: Header, Footer, PredictionCard, CreatePredictionModal, ConnectWallet
- **Hooks**: useContract, useWalletStatus, usePredictions
- **ABIs**: JSON interfaces for contract interaction

## Development Workflow

1. Make changes to the contracts
2. Build and test the contracts with Scarb
3. Update the frontend ABIs if contract interfaces change
4. Run the frontend development server
5. Test the full application locally

## Deployment

### Smart Contracts

1. Deploy the contracts to Starknet using Scarb
2. Update the contract addresses in the frontend

### Frontend

1. Build the production bundle:
```bash
cd frontend
yarn build
```

2. Deploy the static files to your preferred hosting service

## Optimizations

The project has been optimized for:

1. **Performance**: Multi-stage Docker build, optimized frontend bundle
2. **Security**: Proper contract validation and error handling
3. **User Experience**: Responsive design, wallet integration, loading states
4. **Maintainability**: Modular architecture, TypeScript, ESLint, Prettier

## Future Improvements

1. Implement comprehensive test suite for contracts
2. Add more advanced prediction features (conditional predictions, markets)
3. Enhance the oracle system with multiple data sources
4. Improve cross-chain bridging with more networks
5. Add analytics dashboard for platform metrics

## License

This project is licensed under the MIT License - see the LICENSE file for details.
