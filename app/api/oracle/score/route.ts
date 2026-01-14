import { NextResponse } from 'next/server';
import { getBalanceSheet } from '@/lib/quickbooks/service';
import { calculateFinancials } from '@/lib/oracle/engine';
import { generateSolvencyProof } from '@/lib/oracle/proof';

export async function GET() {
    // Mock User ID for V1 demo
    const userId = 'user_123';

    try {
        // 1. Try to fetch real data
        const balanceSheet = await getBalanceSheet(userId);
        const metrics = calculateFinancials(balanceSheet);

        // 2. Generate Proof
        const companyAddress = "0x1234567890123456789012345678901234567890"; // Mock company address
        const proof = await generateSolvencyProof(companyAddress, metrics.solvencyRatio, metrics.liquidityRatio, metrics.timestamp);

        return NextResponse.json({
            source: 'Live QuickBooks Data',
            metrics,
            proof
        });

    } catch (e: any) {
        console.warn("Falling back to mock data:", e.message);

        // Fallback Mock Data Logic
        const now = new Date();
        const baseScore = 85;
        const variance = Math.floor(Math.random() * 15);
        const finalScore = baseScore + (Math.random() > 0.5 ? variance : -variance);
        const status = finalScore >= 90 ? "OPTIMAL" : finalScore >= 70 ? "HEALTHY" : "RISK";

        return NextResponse.json({
            source: 'Mock Data (Not Connected)',
            score: finalScore,
            status: status,
            lastSync: now.toISOString(),
            sources: [
                { name: "Stripe", status: "CONNECTED", latency: "120ms", dataPoint: "MRR: $1.2M (Confirmed)" },
                { name: "Mercury", status: "CONNECTED", latency: "45ms", dataPoint: "Cash Reserve: >18mo Burn" },
                { name: "QuickBooks", status: "DISCONNECTED", latency: "-", dataPoint: "Connect to enable" },
                { name: "Plaid", status: "VERIFIED", latency: "85ms", dataPoint: "Identity: Match" }
            ]
        });
    }
}
