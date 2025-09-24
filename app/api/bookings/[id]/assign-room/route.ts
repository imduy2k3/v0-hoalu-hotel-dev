import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { roomId } = await request.json()
    const bookingId = parseInt(params.id)

    console.log('🏠 Assigning room:', { bookingId, roomId })

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      )
    }

    // Get booking details first
    const bookingResult = await query(`
      SELECT b.*, rt.name as room_type_name
      FROM bookings b
      JOIN room_types rt ON b.room_type_id = rt.id
      WHERE b.id = $1
    `, [bookingId])

    if (bookingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = bookingResult.rows[0]

    // Check if room is available
    const roomResult = await query(`
      SELECT r.*, rt.name as room_type_name
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = $1 AND r.status = 'available'
    `, [roomId])

    if (roomResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Room not available' },
        { status: 400 }
      )
    }

    const room = roomResult.rows[0]

    // Check if room type matches booking room type
    if (room.room_type_id !== booking.room_type_id) {
      return NextResponse.json(
        { error: 'Room type does not match booking room type' },
        { status: 400 }
      )
    }

    // Start transaction
    await query('BEGIN')

    try {
      // Create room assignment record
      await query(`
        INSERT INTO room_assignments (
          booking_id, room_id, check_in_date, check_out_date, 
          status, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, 'assigned', NOW(), NOW())
      `, [
        bookingId,
        roomId,
        booking.check_in_date,
        booking.check_out_date
      ])

      // Update room status to occupied (Đang sử dụng)
      await query(`
        UPDATE rooms 
        SET status = 'occupied', updated_at = NOW()
        WHERE id = $1
      `, [roomId])

      // Update booking status to confirmed if it's pending
      if (booking.status === 'pending') {
        await query(`
          UPDATE bookings 
          SET status = 'confirmed', updated_at = NOW()
          WHERE id = $1
        `, [bookingId])
      }

      await query('COMMIT')

      console.log('✅ Room assigned successfully')
      
      return NextResponse.json({
        id: bookingId,
        assigned_room_id: roomId,
        room_number: room.room_number,
        room_type_name: room.room_type_name,
        status: 'success',
        message: 'Room assigned successfully'
      })
    } catch (error) {
      await query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('❌ Error assigning room to booking:', error)
    return NextResponse.json(
      { error: 'Failed to assign room to booking', details: error.message },
      { status: 500 }
    )
  }
}
