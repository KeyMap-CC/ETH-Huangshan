# UnlockX - Decentralized Position Trading Protocol

## Project Description

UnlockX is an innovative DeFi protocol that revolutionizes how users manage and trade their lending positions. Built on Ethereum, UnlockX enables users to migrate their Aave V3 positions into tradeable formats, creating a marketplace for collateral and debt positions. The protocol leverages flash loans for gas-efficient position migration and provides an automated order book system for position trading.

**Key Problems Solved:**
- **Position Illiquidity**: Traditional lending positions are locked and non-tradeable
- **Capital Inefficiency**: Users can't easily exit or optimize their positions
- **Risk Management**: Limited options for position hedging and profit-taking
- **Migration Costs**: High gas costs when moving positions between protocols

**Main Functions:**
- **Position Migration**: Seamlessly transfer Aave V3 positions to isolated PIV (Position-in-Vault) contracts
- **Order Trading**: Create buy/sell orders for collateral and debt tokens
- **Automated Execution**: Router system for efficient order matching and execution
- **Arbitrage Opportunities**: Leverage flash loans for amplified trading strategies

## Ethereum Ecosystem Integration

UnlockX is deeply integrated with the Ethereum DeFi ecosystem:

### Smart Contract Architecture
- **Solidity Contracts**: Built using Solidity for EVM compatibility
- **Foundry Framework**: Leveraging modern development tooling for smart contract development
- **OpenZeppelin Standards**: Using battle-tested implementations for security

### Aave V3 Integration
- **Flash Loan Integration**: Utilizes Aave V3 flash loans for capital-efficient position migration
- **Pool Interaction**: Direct integration with Aave V3 Pool contract for lending operations
- **aToken Management**: Handles Aave interest-bearing tokens for collateral positions
- **Debt Token Support**: Manages both stable and variable rate debt tokens

### EVM Chain Compatibility
- **Multi-chain Support**: Designed to work on any EVM-compatible chain with Aave V3
- **Gas Optimization**: Efficient contract design to minimize transaction costs
- **Event Emission**: Comprehensive event logging for indexing and analytics

### DeFi Composability
- **Router Pattern**: Modular architecture allowing integration with other protocols
- **Token Standards**: Full ERC-20 compatibility for seamless token interactions
- **Price Oracle Ready**: Architecture supports integration with price feeds

## Technology Stack

### Smart Contracts (Backend)
- **Solidity ^0.8.0**: Core smart contract language
- **Foundry**: Development framework and testing suite
- **OpenZeppelin Contracts**: Security-audited contract libraries
- **Aave V3 SDK**: Official Aave protocol integration
- **Chainlink Contracts**: Price feed integration ready

### Frontend Application
- **Next.js 14**: React-based frontend framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern utility-first styling
- **Vite**: Fast build tooling
- **ethers.js**: Ethereum blockchain interaction
- **Wagmi**: React hooks for Ethereum

### Backend Services
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **MongoDB**: Database for order management
- **Web3.js**: Blockchain interaction library
- **Jest**: Testing framework

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **TypeScript**: Type checking across the stack

### Infrastructure
- **Docker**: Containerization for deployment
- **Vercel**: Frontend deployment platform
- **MongoDB Atlas**: Cloud database hosting
- **Infura/Alchemy**: Ethereum node providers

## Installation and Operation Guide

### Prerequisites
- Node.js v18+ and npm/pnpm
- MongoDB (local or cloud)
- Foundry (for smart contract development)
- MetaMask or compatible Web3 wallet

### 1. Smart Contract Deployment

```bash
cd UnlockX-Core

# Install Foundry dependencies
forge soldeer update
forge build

# Deploy to testnet (Sepolia)
forge script script/DeployRouter.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast

# Verify contracts
forge verify-contract <router_address> Router --etherscan-api-key $ETHERSCAN_API_KEY
```

### 2. Backend Server Setup

```bash
cd UnlockX-Web/server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration:
# - MongoDB connection string
# - Web3 provider URL
# - Contract addresses

# Start the server
npm start

# For development with auto-restart
npm run dev
```

### 3. Frontend Application Setup

```bash
cd UnlockX-Web/client

# Install dependencies
npm install
# or
pnpm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with:
# - API base URL
# - Contract addresses
# - RPC endpoints

# Start development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
```

### 4. Environment Configuration

#### Required Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/unlockx
WEB3_PROVIDER_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PIV_ADDRESS=0x...
ROUTER_ADDRESS=0x...
ENABLE_ORDER_SYNC=true
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_PIV_ADDRESS=0x...
NEXT_PUBLIC_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_MOCK_MODE=false
```

### 5. Testing

```bash
# Test smart contracts
cd UnlockX-Core
forge test

# Test backend
cd UnlockX-Web/server
npm test

# Test frontend
cd UnlockX-Web/client
npm test
```

### 6. Production Deployment

The application includes Docker configurations and deployment scripts for easy production deployment on cloud platforms.

## Project Highlights/Innovations

### 🚀 **Capital Efficiency Revolution**
UnlockX introduces unprecedented capital efficiency through flash loan-powered position migration. Users can leverage their initial capital by 5x or more, turning a 500 USDC investment into control over a 2,500 USDC position.

### 💡 **Tradeable Debt Positions**
First-of-its-kind marketplace for trading debt and collateral positions. Users can create limit orders for their positions, enabling:
- Automated profit-taking when assets reach target prices
- Risk management through position hedging
- Liquidity provision for position exits

### ⚡ **Gas-Optimized Architecture**
- **Router Pattern**: Batch multiple operations in single transactions
- **Flash Loan Integration**: Eliminate need for additional capital during migration
- **Efficient Order Matching**: Optimized algorithms for minimal gas consumption

### 🔄 **Seamless Aave Integration**
- Direct migration from Aave V3 positions without manual steps
- Maintains all benefits of Aave lending (interest earning, liquidation protection)
- Adds trading capabilities on top of existing positions

### 🎯 **Arbitrage Amplification**
The protocol enables sophisticated arbitrage strategies:
- Use flash loans to establish leveraged positions
- Create automated orders for profit realization
- Achieve 200%+ returns on 20% asset appreciation through leverage

### 🏗️ **Modular Architecture**
- **PIV Contracts**: Isolated position management for security
- **Router System**: Scalable order execution across multiple PIVs
- **API Layer**: RESTful backend for order book management
- **Frontend Integration**: User-friendly interface for complex DeFi operations

## Future Development Plan

### Phase 1: Core Enhancement (Q2 2024)
- Multi-chain deployment (Polygon, Arbitrum, Optimism)
- Advanced order types (stop-loss, take-profit combinations)
- Integration with additional lending protocols (Compound, Morpho)

### Phase 2: Advanced Features (Q3 2024)
- Automated portfolio rebalancing
- Cross-chain position migration
- Integration with yield farming strategies
- Mobile application development

### Phase 3: Ecosystem Expansion (Q4 2024)
- Governance token launch and DAO formation
- Liquidity mining programs
- Partner protocol integrations
- Advanced analytics and reporting tools

## Demo Video/Screenshots

### 🎥 Demo Video
[Demo Video Link - To be uploaded to YouTube/Bilibili]

### 📸 Application Screenshots

**Main Trading Interface:**
- Position overview with Aave integration
- Order book with real-time pricing
- One-click migration functionality

**Swap Interface:**
- Token selection with balance display
- Real-time price calculations
- Transaction progress tracking

**Position Management:**
- Detailed position analytics
- Order history and status
- Risk metrics and liquidation warnings

### 🔗 Live Application
- **Frontend**: [Deployed on Vercel - URL to be provided]
- **Smart Contracts**: Verified on Etherscan
- **API Documentation**: Available at `/api/docs`

## Team Members

This project was developed as part of the ETH-Huangshan hackathon, showcasing the potential of innovative DeFi position management solutions.

---

*UnlockX represents the next evolution in DeFi position management, combining the security of established protocols like Aave with the innovation of tradeable positions and automated execution. The protocol opens new possibilities for capital efficiency and risk management in decentralized finance.*