import { createWalletClient, http, createPublicClient, parseAbi, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet, foundry } from 'viem/chains';
import { getBalanceSheet } from '@/lib/quickbooks/service';
import { calculateFinancials } from '@/lib/oracle/engine';
import { generateSolvencyProof } from '@/lib/oracle/proof';
import dotenv from 'dotenv';

dotenv.config();

const ABI = [
    "function publishProvableSolvency(address company, int256 solvencyRatio, uint256 liquidityRatio, uint256 timestamp, bytes calldata signature) external"
];

async function main() {
    // 1. Setup Client
    const account = privateKeyToAccount((process.env.ORACLE_PRIVATE_KEY as `0x${string}`) || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
    const client = createWalletClient({
        account,
        chain: foundry, // Default to Anvil
        transport: http()
    });
    const publicClient = createPublicClient({
        chain: foundry,
        transport: http()
    });

    // Address of the deployed contract (Fill this in after deployment!)
    const REGISTRY_ADDRESS = process.env.REGISTRY_ADDRESS as `0x${string}`;
    if (!REGISTRY_ADDRESS) {
        console.error("Please set REGISTRY_ADDRESS in .env or script");
        process.exit(1);
    }

    console.log("Fetching Live Metrics...");
    // Mock user for script execution context
    const userId = 'user_123';
    // Note: This script assumes it can access the DB via Supabase service role from .env

    // For simplicity, let's fetch from the API url if running, OR just use the library functions directly
    // Using library functions directly (requires .env to be loaded)
    const balanceSheet = await getBalanceSheet(userId);
    const metrics = calculateFinancials(balanceSheet);
    console.log("Metrics:", metrics);

    const companyAddress = "0x1234567890123456789012345678901234567890";
    const proof = await generateSolvencyProof(companyAddress, metrics.solvencyRatio, metrics.liquidityRatio, metrics.timestamp);
    console.log("Generated Proof Signature:", proof.signature);

    console.log("Submitting to Blockchain...");
    const hash = await client.writeContract({
        address: REGISTRY_ADDRESS,
        abi: parseAbi(ABI),
        functionName: 'publishProvableSolvency',
        args: [
            proof.data.company as `0x${string}`,
            BigInt(proof.data.ratio),
            BigInt(proof.data.liquidity),
            BigInt(proof.data.timestamp),
            proof.signature
        ]
    });

    console.log("Transaction Hash:", hash);
}

main().catch(console.error);
