import { NextRequest, NextResponse } from 'next/server'
import { roomTypesService } from '@/lib/data-service'

export async function GET(request: NextRequest) {
  try {
    const roomTypes = await roomTypesService.getAll()
    return NextResponse.json(roomTypes)
  } catch (error) {
    console.error('Error fetching room types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch room types' },
      { status: 500 }
    )
  }
}