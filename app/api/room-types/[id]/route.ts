import { NextRequest, NextResponse } from 'next/server'
import { roomTypesService } from '@/lib/data-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomType = await roomTypesService.getById(params.id)
    
    if (!roomType) {
      return NextResponse.json(
        { error: 'Room type not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(roomType)
  } catch (error) {
    console.error('Error fetching room type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch room type' },
      { status: 500 }
    )
  }
}
