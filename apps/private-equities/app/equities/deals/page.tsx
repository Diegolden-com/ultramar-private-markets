'use client';

import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { formatUnits, parseUnits } from 'viem';
import { Loader2, AlertCircle } from 'lucide-react';

export default function DealsPage() {
    const { ready, authenticated, login } = usePrivy();
    const { wallets } = useWallets();
    const [activeTab, setActiveTab] = useState<'invest' | 'portfolio'>('invest');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');

    // Form states
    const [investAmount, setInvestAmount] = useState('');

    // Mock Data (since contracts aren't deployed)
    const [dealStats] = useState({
        raised: BigInt(0),
        hardCap: parseUnits('1000000', 18),
        softCap: parseUnits('500000', 18),
        endTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 7), // 7 days
        minContribution: parseUnits('100', 18),
    });

    const wallet = wallets[0];

    const handleInvest = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 500));
        setStatus('Public subscriptions are disabled. Interest remains non-binding until counsel approves the offering path, eligibility workflow, documents, and funds flow.');
        setLoading(false);
    };

    const handleClaimTokens = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 500));
        setStatus('Token claims are disabled in the public demo until transfer controls and investor eligibility are approved.');
        setLoading(false);
    };

    const handleClaimDividends = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 500));
        setStatus('Dividend claims are disabled in the public demo until post-close reporting and custody controls are live.');
        setLoading(false);
    };

    if (!ready) return <div className="flex h-screen items-center justify-center bg-black text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Diligence Access</h1>
                    <p className="text-white/60">Ultramar Private Equity counsel-gated portal</p>
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
                            Counsel-gated
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                        <div className="rounded-2xl bg-black/40 p-4">
                            <p className="text-xs text-zinc-500">Target Raise</p>
                            <p className="mt-1 text-xl font-medium">${formatUnits(dealStats.hardCap, 18)}</p>
                            <p className="text-xs text-zinc-600">internal working frame</p>
                        </div>
                        <div className="rounded-2xl bg-black/40 p-4">
                            <p className="text-xs text-zinc-500">Min Ticket</p>
                            <p className="mt-1 text-xl font-medium">${formatUnits(dealStats.minContribution, 18)}</p>
                        </div>
                        <div className="rounded-2xl bg-black/40 p-4">
                            <p className="text-xs text-zinc-500">Illustrative Return</p>
                            <p className="mt-1 text-xl font-medium text-emerald-400">12-15%</p>
                        </div>
                        <div className="rounded-2xl bg-black/40 p-4">
                            <p className="text-xs text-zinc-500">Review Window</p>
                            <p className="mt-1 text-xl font-medium">Counsel TBD</p>
                        </div>
                    </div>

                    {/* Access Status */}
                    <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-amber-300" />
                            <div>
                                <p className="text-sm font-medium text-amber-100">Public subscriptions disabled</p>
                                <p className="mt-1 text-xs leading-5 text-amber-100/70">
                                    This portal records non-binding interest only. Eligibility, documents,
                                    transfer controls, and funds flow require counsel approval before any
                                    transaction path is exposed.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Tabs */}
                    <div className="mb-6 flex gap-4 border-b border-white/10">
                        {(['invest', 'portfolio'] as const).map((tab) => (
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
                                <label className="mb-2 block text-xs text-zinc-400">Indicative Interest (USDC, non-binding)</label>
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
                                        {loading ? <Loader2 className="animate-spin" /> : 'Request Review'}
                                    </button>
                                </div>
                                <p className="mt-4 text-xs text-zinc-500">
                                    No public funds, wire instructions, binding commitments, or
                                    subscription orders are accepted from this page.
                                </p>
                            </div>
                        )}

                        {activeTab === 'portfolio' && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                                    <h3 className="mb-2 font-medium">My Assets</h3>
                                    <div className="mb-4 text-3xl font-light">0.00 <span className="text-base text-zinc-500">ULT-H</span></div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleClaimTokens}
                                            disabled
                                            className="w-full rounded-lg border border-white/20 py-2 text-sm hover:bg-white/10"
                                        >
                                            Claim Disabled
                                        </button>
                                        <button disabled className="w-full rounded-lg border border-white/5 py-2 text-sm text-zinc-600">
                                            Transfer
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                                    <h3 className="mb-2 font-medium">Unclaimed Dividends</h3>
                                    <div className="mb-4 text-3xl font-light text-emerald-400">$50.00 <span className="text-sm text-zinc-500">USDC</span></div>
                                    <button
                                        onClick={handleClaimDividends}
                                        disabled
                                        className="w-full rounded-lg bg-white py-2 text-sm font-medium text-black hover:bg-gray-200"
                                    >
                                        Claim Disabled
                                    </button>
                                    <p className="mt-2 text-xs text-zinc-500">Dividends accrue automatically to token holders.</p>
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
