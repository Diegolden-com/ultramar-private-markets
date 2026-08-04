import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    totalValue: 13602,
    dayChange: -0.01,
    dayChangeValue: -1,
    assets: [
      {
        ticker: "VRX.RE",
        name: "Vertex Realty Core",
        type: "Secondary",
        balance: 8200,
        price: 1.02,
        value: 8364,
        change: 1.3,
        apy: 9.5,
      },
      {
        ticker: "AGR.YLD",
        name: "AgroFuture Yield",
        type: "Secondary",
        balance: 5400,
        price: 0.97,
        value: 5238,
        change: -2.1,
        apy: 22.1,
      },
    ],
  });
}
