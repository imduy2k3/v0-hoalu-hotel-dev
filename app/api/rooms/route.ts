import { NextRequest, NextResponse } from 'next/server'
import { roomsService } from '@/lib/data-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomTypeId = searchParams.get('roomTypeId')
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')
    
    let rooms
    
    if (checkIn && checkOut) {
      rooms = await roomsService.getAvailable(checkIn, checkOut, roomTypeId || undefined)
    } else if (roomTypeId) {
      rooms = await roomsService.getByType(roomTypeId)
    } else {
      rooms = await roomsService.getAll()
    }
    
    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
}
