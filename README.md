This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Onchain Architecture (POC)

The onchain components are designed as a **Proof of Concept** for tokenizing Real World Assets (RWA), enabling permissioned fundraising, and distributing yields on the **Mantle Network**.

> **Note**: These contracts are UNAUDITED and for POC purposes only.

### 1. Smart Contracts
We use a modular architecture consisting of three core contracts:

- **`AssetToken.sol`**: A permissioned ERC20 token representing shares in a specific Private Equity deal.
  - **Inheritance**: `ERC20`, `Ownable`, `AccessControl`
  - **Key Features**:
    - **Whitelist**: Only verified (KYC'd) addresses can hold tokens.
    - **Restricted Transfer**: Transfers are blocked unless both sender and receiver are whitelisted.
    - **Controlled Minting**: Only the `DealManager` or Admin can mint tokens.

- **`DealManager.sol`**: Manages the fundraising lifecycle.
  - **Key Features**:
    - `startDeal`: Admin initializes a deal with duration, funding goal, and hardcap.
    - `contribute`: Whitelisted users deposit Stablecoins (e.g., USDC).
    - `closeDeal`: Finalizes the round. Funds move to treasury; Asset Tokens are minted to investors.
    - `refund`: Allows users to withdraw if the deal fails (e.g. soft cap not met).

- **`YieldDistributor.sol`**: Handles profit distribution.
  - **Key Features**:
    - `depositYield`: Admin deposits yield (in Stablecoins).
    - `claim`: Token holders claim their pro-rata share of the yield.

### 2. Tech Stack
- **Framework**: [Foundry](https://book.getfoundry.sh/)
- **Network**: Mantle Network (Sepolia Testnet / Mainnet)
- **Standards**: ERC20, AccessControl (OpenZeppelin)

### 3. Development
The smart contracts are located in the `contracts/` directory.

**Setup:**
```bash
cd contracts
forge install
forge test
```
