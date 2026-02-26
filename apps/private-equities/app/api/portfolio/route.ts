import { NextResponse } from 'next/server';

export async function GET() {
    // Mock Data simulating real-time blockchain indexing + price feeds
    const portfolio = {
        totalValue: 128450.00,
        dayChange: 2.45, // percent
        dayChangeValue: 3072.50,
        currency: "USD",
        allocation: {
            usdc: 15,
            equities: 85
        },
        assets: [
            {
                ticker: "NXS.LOG",
                name: "Nexus Logistics Node",
                type: "Private Equity",
                balance: 50,
                price: 1050.00,
                value: 52500.00,
                change: 5.2,
                apy: 12.5
            },
            {
                ticker: "VRX.RE",
                name: "Vortex Real Estate",
                type: "Private Equity",
                balance: 1400,
                price: 52.00,
                value: 72800.00,
                change: 0.8,
                apy: 8.4
            },
            {
                ticker: "USDC",
                name: "USD Coin",
                type: "Stablecoin",
                balance: 3150,
                price: 1.00,
                value: 3150.00,
                change: 0.0,
                apy: 4.2
            }
        ]
    };

    // Simulate network latency for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json(portfolio);
}
