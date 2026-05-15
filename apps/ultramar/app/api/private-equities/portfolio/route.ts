import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    totalValue: 27102,
    dayChange: 2.1,
    dayChangeValue: 558,
    assets: [
      {
        ticker: "lcx",
        name: "Lavanderias CX",
        type: "Primary",
        balance: 12500,
        price: 1.08,
        value: 13500,
        change: 4.6,
        apy: 18.4,
      },
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
