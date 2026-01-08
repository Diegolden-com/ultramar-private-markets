'use client';

import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, publicActions, formatUnits, parseUnits } from 'viem';
import { mantleSepoliaTestnet } from 'viem/chains';
import { CONTRACTS } from '@/lib/contracts';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DealsPage() {
    const { ready, authenticated, login } = usePrivy();
    const { wallets } = useWallets();
    const [activeTab, setActiveTab] = useState<'invest' | 'manage' | 'yield'>('invest');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');

    // Form states
    const [investAmount, setInvestAmount] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');

    // Mock Data (since contracts aren't deployed)
    const [dealStats, setDealStats] = useState({
        raised: BigInt(0),
        hardCap: parseUnits('1000000', 18),
        softCap: parseUnits('500000', 18),
        endTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 7), // 7 days
        minContribution: parseUnits('100', 18),
    });

    const wallet = wallets[0];
    const chainId = CONTRACTS.mantleSepolia.chainId;

    const getProvider = async () => {
        if (!wallet) return null;
        const provider = await wallet.getEthereumProvider();
        return createWalletClient({
            chain: mantleSepoliaTestnet,
            transport: custom(provider),
        }).extend(publicActions);
    };

    const handleInvest = async () => {
        if (!investAmount) return;
        setLoading(true);
        setStatus('Approving USDC...');
        try {
            const client = await getProvider();
            if (!client) throw new Error("No provider");

            // 1. Approve USDC (Mock if placeholder)
            // client.writeContract(...) 

            setStatus('Depositing...');
            // 2. Contribute
            // client.writeContract(...)

            // Mock Success
            await new Promise(r => setTimeout(r, 2000));
            setStatus('Success! Investment recorded.');
            setDealStats(prev => ({ ...prev, raised: prev.raised + parseUnits(investAmount, 18) }));
        } catch (e: any) {
            console.error(e);
            setStatus(`Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleClaimTokens = async () => {
        setLoading(true);
        setStatus('Claiming Tokens...');
        try {
            const client = await getProvider();
            await new Promise(r => setTimeout(r, 1500));
            setStatus('Tokens Claimed Successfully!');
        } catch (e: any) {
            setStatus(`Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleStake = async () => {
        if (!stakeAmount) return;
        setLoading(true);
        setStatus('Staking Asset Tokens...');
        try {
            const client = await getProvider();
            await new Promise(r => setTimeout(r, 1500));
            setStatus('Staked successfully! Earning yield.');
        } catch (e: any) {
            setStatus(`Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleClaimYield = async () => {
        setLoading(true);
        setStatus('Claiming Yield...');
        try {
            const client = await getProvider();
            await new Promise(r => setTimeout(r, 1500));
            setStatus('Yield Claimed: 50.00 USDC');
        } catch (e: any) {
            setStatus(`Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!ready) return <div className="flex h-screen items-center justify-center bg-black text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Deals Access</h1>
                    <p className="text-white/60">Ultramar Private Equity Onchain Portal</p>
                </div>
                {!authenticated ? (
                    <button
                        onClick={login}
                        className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black transition hover:bg-white/90"
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right">
                            <div className="text-white/80">{wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}</div>
                            <div className="text-xs text-green-400">Verified Investor</div>
                        </div>
                    </div>
                )}
            </header>

            <main className="mx-auto max-w-5xl">
                {/* Deal Header */}
                <section className="mb-12 rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-xl">
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold">Ultramar Hotel & Resort</h2>
                            <p className="text-zinc-400">Class A Hospitality Asset • Tulum, Mexico</p>
                        </div>
                        <div className="rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-400 border border-emerald-500/20">
                            Live • Fundraising
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                        <div className="rounded-2xl bg-black/40 p-4">
                            <p className="text-xs text-zinc-500">Total Raised</p>
                            <p className="mt-1 text-xl font-medium">${formatUnits(dealStats.raised, 18)}</p>
                            <p className="text-xs text-zinc-600">of ${formatUnits(dealStats.hardCap, 18)}</p>
                        </div>
                        <div className="rounded-2xl bg-black/40 p-4">
                            <p className="text-xs text-zinc-500">Min Ticket</p>
                            <p className="mt-1 text-xl font-medium">${formatUnits(dealStats.minContribution, 18)}</p>
                        </div>
                        <div className="rounded-2xl bg-black/40 p-4">
                            <p className="text-xs text-zinc-500">Variable APY</p>
                            <p className="mt-1 text-xl font-medium text-emerald-400">12-15%</p>
                        </div>
                        <div className="rounded-2xl bg-black/40 p-4">
                            <p className="text-xs text-zinc-500">Ends In</p>
                            <p className="mt-1 text-xl font-medium">6d 14h</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="mb-2 flex justify-between text-xs text-zinc-400">
                            <span>Progress</span>
                            <span>{Number(dealStats.raised * BigInt(100) / dealStats.hardCap)}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                            <div
                                className="h-full bg-white transition-all duration-500"
                                style={{ width: `${Number(dealStats.raised * BigInt(100) / dealStats.hardCap)}%` }}
                            />
                        </div>
                    </div>

                    {/* Action Tabs */}
                    <div className="mb-6 flex gap-4 border-b border-white/10">
                        {(['invest', 'manage', 'yield'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-medium transition-colors ${activeTab === tab
                                    ? 'border-b-2 border-white text-white'
                                    : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[200px]">
                        {activeTab === 'invest' && (
                            <div className="max-w-md">
                                <label className="mb-2 block text-xs text-zinc-400">Investment Amount (USDC)</label>
                                <div className="flex gap-4">
                                    <input
                                        type="number"
                                        value={investAmount}
                                        onChange={(e) => setInvestAmount(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 placeholder:text-zinc-700 focus:border-white/30 focus:outline-none"
                                        placeholder="Min $1,000"
                                    />
                                    <button
                                        onClick={handleInvest}
                                        disabled={loading || !authenticated}
                                        className="whitespace-nowrap rounded-xl bg-white px-8 font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Invest Now'}
                                    </button>
                                </div>
                                <p className="mt-4 text-xs text-zinc-500">
                                    * This is a POC. Contracts are on Mantle Sepolia but currently using mocks for UI demo.
                                    <br />Target Address: {CONTRACTS.mantleSepolia.dealManager.address}
                                </p>
                            </div>
                        )}

                        {activeTab === 'manage' && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                                    <h3 className="mb-2 font-medium">My Allocation</h3>
                                    <div className="mb-4 text-3xl font-light">$0.00</div>
                                    <button
                                        onClick={handleClaimTokens}
                                        disabled={loading || !authenticated}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 py-2 text-sm hover:bg-white/10"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Claim Asset Tokens'}
                                    </button>
                                </div>
                                <div className="rounded-xl border border-white/5 bg-white/5 p-6 opacity-50">
                                    <h3 className="mb-2 font-medium">Refund</h3>
                                    <p className="mb-4 text-sm text-zinc-400">Available if Short Cap not met by deadline.</p>
                                    <button disabled className="w-full rounded-lg bg-zinc-800 py-2 text-sm text-zinc-500">
                                        Refund Unavailable
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'yield' && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                                    <h3 className="mb-2 font-medium">Stake for Yield</h3>
                                    <div className="mb-4 flex gap-2">
                                        <input
                                            type="number"
                                            value={stakeAmount}
                                            onChange={(e) => setStakeAmount(e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
                                            placeholder="Amount ULT-H"
                                        />
                                        <button
                                            onClick={handleStake}
                                            className="whitespace-nowrap rounded-lg bg-emerald-500/20 px-4 text-sm text-emerald-400 hover:bg-emerald-500/30"
                                        >
                                            Stake
                                        </button>
                                    </div>
                                    <p className="text-xs text-zinc-500">Staking Contract: {CONTRACTS.mantleSepolia.yieldDistributor.address.slice(0, 8)}...</p>
                                </div>
                                <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                                    <h3 className="mb-2 font-medium">Claimable Yield</h3>
                                    <div className="mb-4 text-3xl font-light text-emerald-400">$50.00 <span className="text-sm text-zinc-500">USDC</span></div>
                                    <button
                                        onClick={handleClaimYield}
                                        className="w-full rounded-lg bg-white py-2 text-sm font-medium text-black hover:bg-gray-200"
                                    >
                                        Claim to Wallet
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Bar */}
                    {status && (
                        <div className="mt-8 flex items-center gap-3 rounded-lg bg-blue-500/10 px-4 py-3 text-sm text-blue-200 border border-blue-500/20">
                            <AlertCircle className="w-4 h-4" />
                            {status}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
