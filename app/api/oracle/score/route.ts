import { NextResponse } from 'next/server';

export async function GET() {
    // Simulate network latency for external API calls (Stripe, Plaid, Mercury)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data ingestion from "Trusted Sources"
    const now = new Date();

    // Randomized mock logic for demonstration
    const baseScore = 85;
    const variance = Math.floor(Math.random() * 15); // 0-14
    const finalScore = baseScore + (Math.random() > 0.5 ? variance : -variance);

    const status = finalScore >= 90 ? "OPTIMAL" : finalScore >= 70 ? "HEALTHY" : "RISK";

    const payload = {
        score: finalScore,
        status: status,
        lastSync: now.toISOString(),
        sources: [
            {
                name: "Stripe",
                status: "CONNECTED",
                latency: "120ms",
                dataPoint: "MRR: $1.2M (Confirmed)"
            },
            {
                name: "Mercury",
                status: "CONNECTED",
                latency: "45ms",
                dataPoint: "Cash Reserve: >18mo Burn"
            },
            {
                name: "QuickBooks",
                status: "CONNECTED",
                latency: "210ms",
                dataPoint: "Audit Trail: Clean"
            },
            {
                name: "Plaid",
                status: "VERIFIED",
                latency: "85ms",
                dataPoint: "Identity: Match"
            }
        ]
    };

    return NextResponse.json(payload);
}
