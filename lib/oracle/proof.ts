import { createWalletClient, http, toHex, keccak256, encodePacked } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

// In production, use a secure KMS (e.g., AWS KMS, Google Secret Manager)
const ORACLE_PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';

const account = privateKeyToAccount(ORACLE_PRIVATE_KEY as `0x${string}`);

export async function generateSolvencyProof(companyAddress: string, ratio: number, timestamp: number) {
    // We sign the tuple (company, ratio, timestamp)
    // Ratio is multiplied by 100 for 2 decimals precision if sent as uint
    const ratioScaled = Math.floor(ratio * 100);

    const messageHash = keccak256(
        encodePacked(
            ['address', 'uint256', 'uint256'],
            [companyAddress as `0x${string}`, BigInt(ratioScaled), BigInt(timestamp)]
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
            timestamp
        }
    };
}
