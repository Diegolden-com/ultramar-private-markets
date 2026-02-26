'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { mantle, mantleSepoliaTestnet } from 'viem/chains';

import { ThemeProvider } from "@/components/theme-provider";

const ENABLE_TESTNET = process.env.NEXT_PUBLIC_ENABLE_TESTNET === 'true';

export default function Providers({ children }: { children: React.ReactNode }) {
    const defaultChain = ENABLE_TESTNET ? mantleSepoliaTestnet : mantle;
    const supportedChains = [defaultChain];

    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
                defaultChain,
                supportedChains,
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets',
                    },
                },
            }}
        >
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </PrivyProvider>
    );
}
