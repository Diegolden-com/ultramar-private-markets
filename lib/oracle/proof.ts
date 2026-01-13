import { createWalletClient, http, toHex, keccak256, encodePacked } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

// In production, use a secure KMS (e.g., AWS KMS, Google Secret Manager)
const ORACLE_PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';

const account = privateKeyToAccount(ORACLE_PRIVATE_KEY as `0x${string}`);

export async function generateSolvencyProof(companyAddress: string, ratio: number, liquidity: number, timestamp: number) {
    // We sign the tuple (company, solvencyRatio, liquidityRatio, timestamp)
    // Ratio is multiplied by 100 for 2 decimals precision if sent as uint (but here it's int256)
    const ratioScaled = Math.floor(ratio * 100);
    const liquidityScaled = Math.floor(liquidity * 100);

    const messageHash = keccak256(
        encodePacked(
            ['address', 'int256', 'uint256', 'uint256'],
            [companyAddress as `0x${string}`, BigInt(ratioScaled), BigInt(liquidityScaled), BigInt(timestamp)]
        )
    );

    const signature = await account.signMessage({
        message: { raw: messageHash }
    });

    return {
        signer: account.address,
        signature,
        data: {
            company: companyAddress,
            ratio: ratioScaled,
            liquidity: liquidityScaled,
            timestamp
        }
    };
}
