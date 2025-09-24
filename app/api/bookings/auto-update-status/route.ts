import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Auto-updating booking statuses...')
    
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    
    // Update bookings that should be checked in today
    const checkInResult = await query(`
      UPDATE bookings 
      SET status = 'checked_in', updated_at = NOW()
      WHERE status = 'confirmed' 
      AND check_in_date = $1
      RETURNING id, booking_reference, status
    `, [today])
    
    // Update bookings that should be completed (check-out date passed)
    const checkOutResult = await query(`
      UPDATE bookings 
      SET status = 'checked_out', updated_at = NOW()
      WHERE status = 'checked_in' 
      AND check_out_date < $1
      RETURNING id, booking_reference, status
    `, [today])
    
    // Update room statuses based on booking statuses
    // Set rooms to available for completed bookings
    await query(`
      UPDATE rooms 
      SET status = 'available', updated_at = NOW()
      WHERE id IN (
        SELECT ra.room_id 
        FROM room_assignments ra
        JOIN bookings b ON ra.booking_id = b.id
        WHERE b.status = 'checked_out'
        AND ra.status = 'assigned'
      )
    `)
    
    // Update room assignments status
    await query(`
      UPDATE room_assignments 
      SET status = 'checked_out', updated_at = NOW()
      WHERE booking_id IN (
        SELECT id FROM bookings WHERE status = 'checked_out'
      )
    `)
    
    console.log('✅ Auto-update completed:', {
      checkedIn: checkInResult.rows.length,
      checkedOut: checkOutResult.rows.length
    })
    
    return NextResponse.json({
      success: true,
      checkedIn: checkInResult.rows.length,
      checkedOut: checkOutResult.rows.length,
      message: 'Booking statuses updated successfully'
    })
    
  } catch (error) {
    console.error('❌ Error auto-updating booking statuses:', error)
    return NextResponse.json(
      { error: 'Failed to auto-update booking statuses', details: error.message },
      { status: 500 }
    )
  }
}
