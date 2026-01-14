# Ultramar Private Equities (MVP)

Ultramar is a vertically integrated financial operating system running on the **Mantle Network**, designed to tokenize Real World Assets (RWA) and provide cryptographic proofs of solvency.

## 🚀 MVP Deployment (Mantle Sepolia)

- **SolvencyRegistry Contract**: `0xe97194B91148a4ED3642139c20e8B1DA8CCeaE21`
- **Explorer Link**: [View on Mantle Explorer](https://explorer.sepolia.mantle.xyz/address/0xe97194B91148a4ED3642139c20e8B1DA8CCeaE21)
- **Latest Proof Tx**: `0xafebb592f3c70494f003fa8affdd82fc33160bd0f358bb816530ee6e5efd7675`

---

## 📊 Project Status

- **Frontend**: Complete and polished (`/portfolio`, `/oracle`, `/market`).
- **Backend**: Functional Integration with QuickBooks and Mantle Testnet.
- **Contracts**: Deployed and verifying proofs on-chain.

## 🎯 System Objectives

1.  **Real-Time Solvency**: Connect to accounting systems (QuickBooks) to generate ZK/cryptographic proofs of solvency.
2.  **On-Chain Verification**: Publish proofs to the blockchain for transparent, immutable monitoring.
3.  **Investor Protection**: Ensure equity represents a true residual claim (Assets - Liabilities).
4.  **Dividend Distribution**: Facilitate automated profit sharing based on validated financial results.

## 🏗 System Architecture

### 1. Corporate Structure
- **Operating Company**: Local entity (e.g., business in Mexico).
- **SPV (Special Purpose Vehicle)**: Holding company in investor-friendly jurisdiction (Delaware, Singapore, etc.) owning 100% of the Operating Company.

### 2. Accounting Integration (The Oracle)
- **Source of Truth**: QuickBooks (accessed via OAuth 2.0).
- **Process**:
    - Fetches Balance Sheet (Assets, Liabilities, Equity).
    - Computes Solvency Ratio (`(Assets - Liabilities) / Liabilities`).
    - Signs data with a dedicated Oracle Private Key.
    - **Privacy**: Only the ratios and integrity proofs are published; raw ledger data remains private.

### 3. Smart Contracts (Foundry)
- **`SolvencyRegistry.sol`**: Stores and verifies Oracle proofs.
- **`AssetToken.sol`**: Permissioned ERC20 for equity shares.
- **`SimpleAMM.sol`**: Automated Market Maker for secondary trading (Uniswap V2 style x*y=k).

### 4. Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, Framer Motion.
- **Backend**: Next.js API Routes, Intuit OAuth, Viem (EVM interaction).
- **Chain**: Mantle Sepolia Testnet.

## 🔮 Next Steps & Roadmap

- [ ] **Backend Hardening**: Enhance error handling for the Oracle loop.
- [ ] **ZK Proof Generation**: Move from trusted signer (Oracle) to full Zero-Knowledge Proofs (Circom/Halo2).
- [ ] **Portfolio Module**: Connect frontend charts to live subgraphs.
- [ ] **Secondary Market**: Deploy full Uniswap fork for liquidity.
- [ ] **Mainnet Launch**: Deploy legal wrapper and contracts to Mantle Mainnet.

---

## 🛠 Usage

### Development Server
```bash
bun dev
```

### Run Oracle Proof Script
```bash
# Deploys a solvency proof to Mantle Sepolia
bun run scripts/submit_proof.ts
```

### Contract Development
```bash
cd contracts
forge build
forge test
```
