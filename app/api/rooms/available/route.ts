import { NextRequest, NextResponse } from 'next/server'
import { getAvailableRooms } from '@/lib/database-queries'
import { adaptRoom } from '@/lib/database-adapters'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomTypeId = searchParams.get('roomTypeId')
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')

    console.log('🔍 Fetching available rooms:', { roomTypeId, checkIn, checkOut })

    if (!roomTypeId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'roomTypeId, checkIn, and checkOut are required' },
        { status: 400 }
      )
    }

    // Get available rooms from database
    const dbRooms = await getAvailableRooms(checkIn, checkOut, parseInt(roomTypeId))
    
    // Convert to application format
    const rooms = dbRooms.map(adaptRoom)

    console.log('✅ Returning available rooms:', rooms.length)
    return NextResponse.json(rooms)
  } catch (error) {
    console.error('❌ Error fetching available rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available rooms', details: error.message },
      { status: 500 }
    )
  }
}
