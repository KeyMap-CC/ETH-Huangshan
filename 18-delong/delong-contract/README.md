# AlgorithmReview DAO

A DAO-based algorithm audit voting contract with governance token.

## Overview

This project implements a decentralized autonomous organization (DAO) for algorithm review. It consists of:

1. **GovernanceToken**: An ERC20 token used for voting in the DAO
2. **AlgorithmReview**: A contract that manages algorithm submissions and voting

## Features

- Token-based voting system
- Committee member management
- Proposal creation and execution
- Algorithm submission and review

## Development Setup

### Prerequisites

- Node.js and npm
- Hardhat

### Installation

```bash
# Install dependencies
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

## Deployment

### Local Deployment

Start a local Hardhat node:

```bash
npx hardhat node
```

In a new terminal, deploy the contracts:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Testnet/Mainnet Deployment

1. Create a `.env` file with your private key and network API keys:

```
PRIVATE_KEY=your_private_key_here
INFURA_API_KEY=your_infura_api_key_here
```

2. Deploy to your chosen network:

```bash
npx hardhat run scripts/deploy.js --network goerli
```

## Interacting with the Contracts

After deployment, update the contract addresses in `scripts/interact.js` and run:

```bash
npx hardhat run scripts/interact.js --network localhost
```

## Contract Architecture

### GovernanceToken

- Standard ERC20 token with minting capabilities
- Used for voting in the DAO

### AlgorithmReview

- Manages committee members
- Handles algorithm submissions
- Processes votes from token holders
- Executes governance decisions

## License

MIT
