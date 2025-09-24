import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { reason } = await request.json()
    const bookingId = parseInt(params.id)

    console.log('❌ Cancelling booking:', { bookingId, reason })

    // Get booking details first
    const bookingResult = await query(`
      SELECT b.*, ra.room_id
      FROM bookings b
      LEFT JOIN room_assignments ra ON b.id = ra.booking_id
      WHERE b.id = $1
    `, [bookingId])

    if (bookingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = bookingResult.rows[0]

    // Check if booking can be cancelled
    if (booking.status === 'checked_out' || booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking cannot be cancelled' },
        { status: 400 }
      )
    }

    // Start transaction
    await query('BEGIN')

    try {
      // Update booking status to cancelled
      await query(`
        UPDATE bookings 
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = $1
      `, [bookingId])

      // If room was assigned, make it available again
      if (booking.room_id) {
        await query(`
          UPDATE rooms 
          SET status = 'available', updated_at = NOW()
          WHERE id = $1
        `, [booking.room_id])

        // Update room assignment status
        await query(`
          UPDATE room_assignments 
          SET status = 'cancelled', updated_at = NOW()
          WHERE booking_id = $1
        `, [bookingId])
      }

      await query('COMMIT')

      console.log('✅ Booking cancelled successfully')
      
      return NextResponse.json({
        id: bookingId,
        status: 'cancelled',
        message: 'Booking cancelled successfully'
      })
    } catch (error) {
      await query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('❌ Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking', details: error.message },
      { status: 500 }
    )
  }
}
