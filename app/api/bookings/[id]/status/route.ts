import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const bookingId = params.id

    console.log('📝 Updating booking status:', { bookingId, status })

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Try to find booking first
    const findResult = await query(
      'SELECT * FROM bookings WHERE id = $1',
      [bookingId]
    )

    console.log('🔍 Found booking:', findResult.rows.length > 0 ? 'Yes' : 'No')

    if (findResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Update booking status
    const result = await query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, bookingId]
    )

    console.log('✅ Update result:', result.rows.length > 0 ? 'Success' : 'Failed')

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('❌ Error updating booking status:', error)
    return NextResponse.json(
      { error: 'Failed to update booking status', details: error.message },
      { status: 500 }
    )
  }
}
