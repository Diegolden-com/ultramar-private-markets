import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/strategies
 *
 * Returns all active strategies with current APY, TVL, and risk metrics.
 * Data is fetched from Supabase strategies table, which is updated by cron jobs.
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: strategies, error } = await supabase
      .from('strategies')
      .select('*')
      .eq('is_active', true)
      .order('risk_level', { ascending: true })

    if (error) {
      console.error('Error fetching strategies:', error)
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch strategies' } },
        { status: 500 }
      )
    }

    // Transform database fields to API response format
    const formattedStrategies = strategies.map(strategy => ({
      id: strategy.id,
      name: strategy.name,
      description: strategy.description,
      riskLevel: strategy.risk_level,
      apy: strategy.current_apy,
      tvl: strategy.current_tvl,
      isActive: strategy.is_active,
      minDeposit: strategy.min_deposit || 100,
      pricePerShare: strategy.current_price_per_share || 1.0,
    }))

    return NextResponse.json({
      strategies: formattedStrategies,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
