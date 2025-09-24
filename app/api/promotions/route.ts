import { NextRequest, NextResponse } from 'next/server'
import { getPromotions } from '@/lib/database-queries'

export async function GET() {
  try {
    const promotions = await getPromotions()
    return NextResponse.json(promotions)
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

