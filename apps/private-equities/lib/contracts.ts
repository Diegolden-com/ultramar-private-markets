import AssetTokenABI from './abi/AssetToken.json';
import DealManagerABI from './abi/DealManager.json';

// Placeholder addresses for Mantle Sepolia (5003)
// In a real scenario, these would be populated after deployment
export const CONTRACTS = {
    mantleSepolia: {
        chainId: 5003,
        assetToken: {
            address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Replace with deployed address
            abi: AssetTokenABI,
        },
        dealManager: {
            address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Replace with deployed address
            abi: DealManagerABI,
        }
    }
} as const;
