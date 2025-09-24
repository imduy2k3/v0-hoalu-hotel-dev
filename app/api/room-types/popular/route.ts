import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching popular room types...')
    
    // First, get all room types
    const roomTypesResult = await query('SELECT * FROM room_types ORDER BY id LIMIT 3')
    console.log('📊 Room types found:', roomTypesResult.rows.length)
    
    // Get booking counts for each room type
    const popularRoomTypes = []
    
    for (const roomType of roomTypesResult.rows) {
      const bookingResult = await query(
        'SELECT COUNT(*) as booking_count, COALESCE(AVG(total_amount), 0) as avg_amount FROM bookings WHERE room_type_id = $1',
        [roomType.id]
      )
      
      const bookingCount = parseInt(bookingResult.rows[0].booking_count)
      const avgAmount = parseFloat(bookingResult.rows[0].avg_amount)
      
      popularRoomTypes.push({
        id: roomType.id.toString(),
        name: roomType.name,
        slug: roomType.name.toLowerCase().replace(/\s+/g, '-'),
        basePrice: parseFloat(roomType.base_price),
        capacity: parseInt(roomType.max_guests),
        sizeSqm: parseFloat(roomType.size_sqm || 0),
        bedType: roomType.bed_type || 'Queen',
        shortDesc: roomType.description || '',
        longDesc: roomType.description || '',
        amenities: Array.isArray(roomType.amenities) ? roomType.amenities : 
                   (typeof roomType.amenities === 'string' ? JSON.parse(roomType.amenities || '[]') : []),
        policies: '',
        images: Array.isArray(roomType.images) ? roomType.images : 
                (typeof roomType.images === 'string' ? JSON.parse(roomType.images || '[]') : []),
        isPublished: true,
        updatedAt: roomType.updated_at,
        bookingCount: bookingCount,
        avgBookingAmount: avgAmount
      })
    }
    
    // Sort by booking count
    popularRoomTypes.sort((a, b) => b.bookingCount - a.bookingCount)
    
    console.log('✅ Popular room types:', popularRoomTypes.map(r => `${r.name}: ${r.bookingCount} bookings`))
    
    return NextResponse.json(popularRoomTypes)
  } catch (error) {
    console.error('❌ Error fetching popular room types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular room types', details: error.message },
      { status: 500 }
    )
  }
}
