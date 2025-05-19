# ProphecySunya

ProphecySunya is a decentralized prediction market platform built on Starknet that integrates prediction markets with blockchain development tools through a modular, layered architecture.

## Overview

ProphecySunya leverages Starknet's scalability and security features while maintaining cross-chain interoperability. The platform allows users to create predictions, verify outcomes through AI oracles, mint NFTs for verified predictions, and participate in governance.

## Architecture

The system is built with a layered architecture:

1. **Smart Contract Layer**: Cairo contracts for core functionality
2. **Core Services Layer**: Business logic and service implementations
3. **Service Layer**: API Gateway and authentication services
4. **User Interface Layer**: UI components for predictions, wallets, and NFTs
5. **Frontend Application**: React-based single-page application

## Smart Contracts

The platform includes the following smart contracts:

- **Prediction Contract**: Manages prediction lifecycle
- **NFT Contract**: Handles NFT minting and transfers for verified predictions
- **Gas Tank Contract**: Provides transaction sponsorship and meta-transactions
- **Oracle Contract**: Processes prediction verification
- **Governance Contract**: Manages proposal creation and voting
- **Bridge Contract**: Enables cross-chain prediction bridging

## Getting Started

### Prerequisites

- [Scarb](https://docs.swmansion.com/scarb/) for Cairo development
- [Starknet Devnet](https://github.com/0xSpaceShard/starknet-devnet) for local testing

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/prophecy-sunya.git
cd prophecy-sunya
```

2. Install dependencies:
```bash
scarb install
```

3. Build the contracts:
```bash
scarb build
```

### Testing

Run the tests for all contracts:
```bash
scarb test
```

## Development Roadmap

- **Phase 1**: Smart Contract Layer implementation
- **Phase 2**: Core Services Layer development
- **Phase 3**: Service Layer and API Gateway
- **Phase 4**: User Interface and Frontend
- **Phase 5**: Cross-chain integration and advanced features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
