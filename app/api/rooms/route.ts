import { NextRequest, NextResponse } from 'next/server'
import { roomsService } from '@/lib/data-service'
import { query } from '@/lib/database'
import { mapToDatabaseRoomStatus } from '@/lib/database-adapters'

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

export async function POST(request: NextRequest) {
  try {
    const roomData = await request.json()
    
    // Check if room number already exists
    const existingRoom = await query(
      'SELECT id FROM rooms WHERE room_number = $1',
      [roomData.roomNumber]
    )
    
    if (existingRoom.rows.length > 0) {
      return NextResponse.json(
        { error: 'Room number already exists' },
        { status: 400 }
      )
    }
    
    // Create new room
    const result = await query(`
      INSERT INTO rooms (room_number, room_type_id, floor, status, special_features)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      roomData.roomNumber,
      parseInt(roomData.roomTypeId),
      roomData.floor,
      mapToDatabaseRoomStatus(roomData.status),
      roomData.notes ? JSON.stringify({ notes: roomData.notes }) : null
    ])
    
    // Convert to application format
    const newRoom = {
      id: result.rows[0].id.toString(),
      roomNumber: result.rows[0].room_number,
      floor: result.rows[0].floor,
      roomTypeId: result.rows[0].room_type_id.toString(),
      status: roomData.status,
      notes: roomData.notes,
      updatedAt: result.rows[0].updated_at
    }
    
    return NextResponse.json(newRoom, { status: 201 })
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
}
