import { samplePositions } from "@/lib/arbitrage";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(samplePositions);
}
