import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/strategies/lending-markets/arbitrage
 *
 * Calculates cross-network arbitrage opportunities for USDC/USDT lending.
 * Based on HF1 backtesting results (Odisea_HF1).
 *
 * Strategy logic:
 * 1. Find highest supply APY across networks
 * 2. Find lowest borrow APY across networks
 * 3. Calculate net APY = supplyAPY - borrowAPY - costs
 * 4. Return opportunities where netAPY > minAPY threshold
 *
 * Query params:
 *  - asset: 'USDC' | 'USDT' | 'ALL' (default: 'USDC')
 *  - minAPY: Minimum profitable spread (default: 2.0)
 *  - entryThreshold: Entry threshold from backtesting (default: 1.0)
 *  - exitThreshold: Exit threshold from backtesting (default: 0.6)
 */

interface LendingRate {
  protocol: string
  network: string
  asset: string
  supplyAPY: number
  borrowAPY: number
  utilization: number
  totalSupply: number
  timestamp: string
}

interface ArbitrageOpportunity {
  asset: string
  supplyPosition: {
    protocol: string
    network: string
    apy: number
    utilization: number
  }
  borrowPosition: {
    protocol: string
    network: string
    apy: number
    utilization: number
  }
  spreadAPY: number
  netAPY: number
  estimatedGasCost: number
  transactionCostScenario: string
  profitable: boolean
  daysInPosition?: number
}

// Transaction cost scenarios from HF1 backtesting
const COST_SCENARIOS = {
  'ULTRA_LOW': 0.0025,
  'LOW': 0.025,
  'MODERATE': 0.05,
  'HIGH': 0.5,
  'VERY_HIGH': 1.0
}

// Cross-network bridge costs (higher than intra-network)
const BRIDGE_COSTS = {
  'ARBITRUM_TO_ETHEREUM': 2.0,
  'ARBITRUM_TO_BASE': 1.5,
  'ETHEREUM_TO_ARBITRUM': 3.0,
  'ETHEREUM_TO_BASE': 2.5,
  'BASE_TO_ARBITRUM': 1.5,
  'BASE_TO_ETHEREUM': 2.5
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const assetFilter = searchParams.get('asset') || 'USDC'
    const minAPY = parseFloat(searchParams.get('minAPY') || '2.0')
    const entryThreshold = parseFloat(searchParams.get('entryThreshold') || '1.0')

    // Fetch current rates
    const ratesUrl = new URL('/api/strategies/lending-markets/rates', request.url)
    ratesUrl.searchParams.set('asset', assetFilter)

    const ratesResponse = await fetch(ratesUrl.toString())

    if (!ratesResponse.ok) {
      throw new Error('Failed to fetch lending rates')
    }

    const ratesData = await ratesResponse.json()
    const rates: LendingRate[] = ratesData.rates

    if (!rates || rates.length === 0) {
      return NextResponse.json({
        opportunities: [],
        message: 'No rates available',
        timestamp: new Date().toISOString()
      })
    }

    // Group rates by asset
    const ratesByAsset = rates.reduce((acc, rate) => {
      if (!acc[rate.asset]) {
        acc[rate.asset] = []
      }
      acc[rate.asset].push(rate)
      return acc
    }, {} as Record<string, LendingRate[]>)

    const opportunities: ArbitrageOpportunity[] = []

    // Calculate arbitrage for each asset
    for (const [asset, assetRates] of Object.entries(ratesByAsset)) {
      // Find best supply rate (highest APY)
      const bestSupply = assetRates.reduce((max, rate) =>
        rate.supplyAPY > max.supplyAPY ? rate : max
      )

      // Find best borrow rate (lowest APY)
      const bestBorrow = assetRates.reduce((min, rate) =>
        rate.borrowAPY < min.borrowAPY ? rate : min
      )

      // Calculate spread
      const spreadAPY = bestSupply.supplyAPY - bestBorrow.borrowAPY

      // Determine if cross-network bridge is needed
      const isCrossNetwork = bestSupply.network !== bestBorrow.network
      const bridgeKey = `${bestBorrow.network}_TO_${bestSupply.network}` as keyof typeof BRIDGE_COSTS
      const bridgeCost = isCrossNetwork ? (BRIDGE_COSTS[bridgeKey] || 2.0) : 0

      // Calculate net APY for different cost scenarios
      for (const [scenario, intraCost] of Object.entries(COST_SCENARIOS)) {
        const totalCost = isCrossNetwork ? bridgeCost : intraCost
        // Convert one-time cost to annualized cost (assuming 30 days in position)
        const annualizedCost = (totalCost / 100000) * (365 / 30) * 100 // As percentage

        const netAPY = spreadAPY - annualizedCost

        if (netAPY > minAPY && spreadAPY > entryThreshold) {
          opportunities.push({
            asset,
            supplyPosition: {
              protocol: bestSupply.protocol,
              network: bestSupply.network,
              apy: bestSupply.supplyAPY,
              utilization: bestSupply.utilization
            },
            borrowPosition: {
              protocol: bestBorrow.protocol,
              network: bestBorrow.network,
              apy: bestBorrow.borrowAPY,
              utilization: bestBorrow.utilization
            },
            spreadAPY: parseFloat(spreadAPY.toFixed(4)),
            netAPY: parseFloat(netAPY.toFixed(4)),
            estimatedGasCost: totalCost,
            transactionCostScenario: scenario,
            profitable: netAPY > minAPY,
            daysInPosition: 30 // Estimated from backtesting
          })
        }
      }
    }

    // Sort by net APY descending
    opportunities.sort((a, b) => b.netAPY - a.netAPY)

    return NextResponse.json({
      opportunities: opportunities.slice(0, 10), // Top 10 opportunities
      count: opportunities.length,
      timestamp: new Date().toISOString(),
      backtestingNotes: {
        source: 'Odisea_HF1',
        period: '2023-2025',
        bestConfiguration: 'USDC Base Configuration',
        historicalReturn: '+8.13%',
        entryThreshold: entryThreshold + '%',
        exitThreshold: '0.6%'
      }
    })
  } catch (error) {
    console.error('Error calculating arbitrage:', error)
    return NextResponse.json(
      {
        error: {
          code: 'CALCULATION_ERROR',
          message: 'Failed to calculate arbitrage opportunities',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}
