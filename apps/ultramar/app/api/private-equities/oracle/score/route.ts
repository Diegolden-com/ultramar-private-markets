import { NextResponse } from "next/server";

export function GET() {
  const assets = 18400000;
  const liabilities = 6200000;
  const equity = assets - liabilities;

  return NextResponse.json({
    source: "Issuer accounting sandbox",
    metrics: {
      assets,
      liabilities,
      equity,
      solvencyRatio: equity / liabilities,
      liquidityRatio: 2.8,
      timestamp: Date.now(),
    },
    proof: {
      signer: "0xe97194B91148a4ED3642139c20e8B1DA8CCeaE21",
      signature:
        "0x8b8fd9bfb7df9220c5f365978fb2f37b4fa7f5f5c8a0dd87f7a80976e5f9f5d1",
    },
  });
}
