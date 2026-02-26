import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/strategies/lending-markets/rates
 *
 * Fetches current lending and borrowing rates from Aave V3 protocol
 * across Arbitrum, Ethereum, and Base networks for USDC and USDT.
 *
 * This implements the HF1 strategy logic documented in the backtesting analysis.
 *
 * Query params:
 *  - asset: 'USDC' | 'USDT' | 'ALL' (default: 'ALL')
 *  - network: 'ARBITRUM' | 'ETHEREUM' | 'BASE' | 'ALL' (default: 'ALL')
 */

interface AaveReserveData {
  symbol: string
  liquidityRate: string
  variableBorrowRate: string
  availableLiquidity: string
  totalDebt: string
  utilizationRate: string
}

interface FormattedRate {
  protocol: string
  network: string
  asset: string
  supplyAPY: number
  borrowAPY: number
  utilization: number
  totalSupply: number
  timestamp: string
}

const AAVE_V3_SUBGRAPHS = {
  ARBITRUM: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-arbitrum',
  ETHEREUM: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3',
  BASE: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-base'
}

// Ray units (10^27) to percentage conversion
const RAY_TO_PERCENT = 1e25

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const assetFilter = searchParams.get('asset') || 'ALL'
    const networkFilter = searchParams.get('network') || 'ALL'

    const assets = assetFilter === 'ALL' ? ['USDC', 'USDT'] : [assetFilter]
    const networks = networkFilter === 'ALL'
      ? ['ARBITRUM', 'ETHEREUM', 'BASE']
      : [networkFilter]

    const allRates: FormattedRate[] = []

    // Fetch rates from each network
    for (const network of networks) {
      for (const asset of assets) {
        try {
          const rate = await fetchAaveRate(network, asset)
          if (rate) {
            allRates.push(rate)
          }
        } catch (error) {
          console.error(`Error fetching ${asset} rate from ${network}:`, error)
          // Continue with other networks/assets
        }
      }
    }

    // Sort by supply APY descending
    allRates.sort((a, b) => b.supplyAPY - a.supplyAPY)

    return NextResponse.json({
      rates: allRates,
      count: allRates.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in lending-markets/rates:', error)
    return NextResponse.json(
      {
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch lending rates',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

async function fetchAaveRate(
  network: string,
  asset: string
): Promise<FormattedRate | null> {
  const subgraphUrl = AAVE_V3_SUBGRAPHS[network as keyof typeof AAVE_V3_SUBGRAPHS]

  if (!subgraphUrl) {
    console.error(`No subgraph URL for network: ${network}`)
    return null
  }

  // GraphQL query to fetch reserve data
  const query = `
    query GetReserveData {
      reserves(where: { symbol: "${asset}" }) {
        symbol
        liquidityRate
        variableBorrowRate
        availableLiquidity
        totalDebt
        utilizationRate
      }
    }
  `

  const response = await fetch(subgraphUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    // Cache for 5 minutes to reduce API calls
    next: { revalidate: 300 }
  })

  if (!response.ok) {
    throw new Error(`Subgraph request failed: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.data?.reserves || data.data.reserves.length === 0) {
    console.warn(`No ${asset} reserve found on ${network}`)
    return null
  }

  const reserve: AaveReserveData = data.data.reserves[0]

  // Convert Ray units to percentages
  const supplyAPY = parseFloat(reserve.liquidityRate) / RAY_TO_PERCENT
  const borrowAPY = parseFloat(reserve.variableBorrowRate) / RAY_TO_PERCENT
  const utilization = parseFloat(reserve.utilizationRate) / 1e2 // Basis points to percentage

  // Convert liquidity from wei to readable units (assuming 6 decimals for USDC/USDT)
  const totalSupply = parseFloat(reserve.availableLiquidity) / 1e6

  return {
    protocol: 'AAVE_V3',
    network,
    asset,
    supplyAPY: parseFloat(supplyAPY.toFixed(4)),
    borrowAPY: parseFloat(borrowAPY.toFixed(4)),
    utilization: parseFloat(utilization.toFixed(2)),
    totalSupply: parseFloat(totalSupply.toFixed(2)),
    timestamp: new Date().toISOString()
  }
}
