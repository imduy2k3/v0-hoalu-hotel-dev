import { NextRequest, NextResponse } from 'next/server'
import { roomsService } from '@/lib/data-service'
import { query } from '@/lib/database'
import { mapToDatabaseRoomStatus } from '@/lib/database-adapters'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomData = await request.json()
    const roomId = parseInt(params.id)
    
    // Update room in database
    const result = await query(`
      UPDATE rooms 
      SET 
        room_number = $2,
        room_type_id = $3,
        floor = $4,
        status = $5,
        special_features = $6,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [
      roomId,
      roomData.roomNumber,
      parseInt(roomData.roomTypeId),
      roomData.floor,
      mapToDatabaseRoomStatus(roomData.status),
      roomData.notes ? JSON.stringify({ notes: roomData.notes }) : null
    ])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }
    
    // Convert back to application format
    const updatedRoom = {
      id: result.rows[0].id.toString(),
      roomNumber: result.rows[0].room_number,
      floor: result.rows[0].floor,
      roomTypeId: result.rows[0].room_type_id.toString(),
      status: roomData.status,
      notes: roomData.notes,
      updatedAt: result.rows[0].updated_at
    }
    
    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error('Error updating room:', error)
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = parseInt(params.id)
    
    // Check if room has active bookings
    const bookingCheck = await query(`
      SELECT COUNT(*) as count
      FROM room_assignments ra
      WHERE ra.room_id = $1 
      AND ra.status IN ('assigned', 'checked_in')
      AND ra.check_out_date >= CURRENT_DATE
    `, [roomId])
    
    if (parseInt(bookingCheck.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete room with active bookings' },
        { status: 400 }
      )
    }
    
    // Delete room
    const result = await query('DELETE FROM rooms WHERE id = $1 RETURNING *', [roomId])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting room:', error)
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    )
  }
}
