const { Pool } = require('pg')

async function testCompleteDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://hoalucity:TicketX123@103.104.119.144:5432/hoalucity',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })

  try {
    console.log('🔍 Testing complete database connection and data...')
    
    const client = await pool.connect()
    console.log('✅ Database connection successful!')
    
    // 1. Users table
    console.log('\n👥 USERS TABLE:')
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users')
    console.log(`Total users: ${usersResult.rows[0].count}`)
    
    const usersData = await client.query(`
      SELECT id, username, email, full_name, role, is_active, created_at, last_login_at
      FROM users 
      ORDER BY created_at DESC
    `)
    console.log('All users:', usersData.rows)
    
    // 2. Room Types table
    console.log('\n🏨 ROOM TYPES TABLE:')
    const roomTypesResult = await client.query('SELECT COUNT(*) as count FROM room_types')
    console.log(`Total room types: ${roomTypesResult.rows[0].count}`)
    
    const roomTypesData = await client.query(`
      SELECT id, name, name_en, base_price, max_guests, size_sqm, bed_type, is_active, created_at 
      FROM room_types 
      ORDER BY created_at DESC
    `)
    console.log('All room types:', roomTypesData.rows)
    
    // 3. Rooms table
    console.log('\n🚪 ROOMS TABLE:')
    const roomsResult = await client.query('SELECT COUNT(*) as count FROM rooms')
    console.log(`Total rooms: ${roomsResult.rows[0].count}`)
    
    const roomsData = await client.query(`
      SELECT id, room_number, room_type_id, floor, status, view_type, created_at 
      FROM rooms 
      ORDER BY room_number
    `)
    console.log('All rooms:', roomsData.rows)
    
    // 4. Customers table
    console.log('\n👤 CUSTOMERS TABLE:')
    const customersResult = await client.query('SELECT COUNT(*) as count FROM customers')
    console.log(`Total customers: ${customersResult.rows[0].count}`)
    
    const customersData = await client.query(`
      SELECT id, first_name, last_name, email, phone, customer_type, loyalty_points, created_at 
      FROM customers 
      ORDER BY created_at DESC
    `)
    console.log('All customers:', customersData.rows)
    
    // 5. Bookings table
    console.log('\n📋 BOOKINGS TABLE:')
    const bookingsResult = await client.query('SELECT COUNT(*) as count FROM bookings')
    console.log(`Total bookings: ${bookingsResult.rows[0].count}`)
    
    const bookingsData = await client.query(`
      SELECT id, booking_reference, customer_id, room_type_id, check_in_date, check_out_date, 
             adults, children, total_nights, total_amount, status, payment_status, created_at 
      FROM bookings 
      ORDER BY created_at DESC
    `)
    console.log('All bookings:', bookingsData.rows)
    
    // 6. Services table
    console.log('\n🛎️ SERVICES TABLE:')
    const servicesResult = await client.query('SELECT COUNT(*) as count FROM services')
    console.log(`Total services: ${servicesResult.rows[0].count}`)
    
    const servicesData = await client.query(`
      SELECT id, name, name_en, category, price, unit, is_active, created_at 
      FROM services 
      ORDER BY created_at DESC
    `)
    console.log('All services:', servicesData.rows)
    
    // 7. Reviews table
    console.log('\n⭐ REVIEWS TABLE:')
    const reviewsResult = await client.query('SELECT COUNT(*) as count FROM reviews')
    console.log(`Total reviews: ${reviewsResult.rows[0].count}`)
    
    const reviewsData = await client.query(`
      SELECT id, booking_id, customer_id, rating, title, comment, is_verified, is_published, created_at 
      FROM reviews 
      ORDER BY created_at DESC
    `)
    console.log('All reviews:', reviewsData.rows)
    
    // 8. Promotions table
    console.log('\n🎁 PROMOTIONS TABLE:')
    const promotionsResult = await client.query('SELECT COUNT(*) as count FROM promotions')
    console.log(`Total promotions: ${promotionsResult.rows[0].count}`)
    
    const promotionsData = await client.query(`
      SELECT id, code, name, type, value, valid_from, valid_to, usage_limit, used_count, is_active, created_at 
      FROM promotions 
      ORDER BY created_at DESC
    `)
    console.log('All promotions:', promotionsData.rows)
    
    // 9. System Settings table
    console.log('\n⚙️ SYSTEM SETTINGS TABLE:')
    const settingsResult = await client.query('SELECT COUNT(*) as count FROM system_settings')
    console.log(`Total settings: ${settingsResult.rows[0].count}`)
    
    const settingsData = await client.query(`
      SELECT id, setting_key, setting_value, description, category, is_public, updated_at 
      FROM system_settings 
      ORDER BY updated_at DESC
    `)
    console.log('All settings:', settingsData.rows)
    
    // Summary statistics
    console.log('\n📈 SUMMARY STATISTICS:')
    const summary = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM room_types) as total_room_types,
        (SELECT COUNT(*) FROM rooms) as total_rooms,
        (SELECT COUNT(*) FROM customers) as total_customers,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM services) as total_services,
        (SELECT COUNT(*) FROM reviews) as total_reviews,
        (SELECT COUNT(*) FROM promotions) as total_promotions,
        (SELECT COUNT(*) FROM system_settings) as total_settings
    `)
    console.log('Database summary:', summary.rows[0])
    
    // Test complex queries
    console.log('\n🔍 TESTING COMPLEX QUERIES:')
    
    // Revenue by month
    const revenueByMonth = await client.query(`
      SELECT 
        EXTRACT(YEAR FROM created_at) as year,
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(*) as booking_count,
        SUM(total_amount) as total_revenue
      FROM bookings 
      WHERE status != 'cancelled'
      GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
      ORDER BY year DESC, month DESC
    `)
    console.log('Revenue by month:', revenueByMonth.rows)
    
    // Room occupancy by room type
    const roomOccupancy = await client.query(`
      SELECT 
        rt.name as room_type,
        COUNT(r.id) as total_rooms,
        COUNT(CASE WHEN r.status = 'available' THEN 1 END) as available_rooms,
        COUNT(CASE WHEN r.status = 'occupied' THEN 1 END) as occupied_rooms,
        COUNT(CASE WHEN r.status = 'maintenance' THEN 1 END) as maintenance_rooms
      FROM room_types rt
      LEFT JOIN rooms r ON rt.id = r.room_type_id
      GROUP BY rt.id, rt.name
      ORDER BY total_rooms DESC
    `)
    console.log('Room occupancy by type:', roomOccupancy.rows)
    
    // Customer statistics
    const customerStats = await client.query(`
      SELECT 
        CONCAT(c.first_name, ' ', c.last_name) as full_name,
        c.email,
        COUNT(b.id) as total_bookings,
        SUM(b.total_amount) as total_spent,
        MAX(b.created_at) as last_booking
      FROM customers c
      LEFT JOIN bookings b ON c.id = b.customer_id
      GROUP BY c.id, c.first_name, c.last_name, c.email
      HAVING COUNT(b.id) > 0
      ORDER BY total_spent DESC
    `)
    console.log('Customer statistics:', customerStats.rows)
    
    // Booking status distribution
    const bookingStatus = await client.query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(total_amount) as total_amount
      FROM bookings 
      GROUP BY status
      ORDER BY count DESC
    `)
    console.log('Booking status distribution:', bookingStatus.rows)
    
    // Room type performance
    const roomTypePerformance = await client.query(`
      SELECT 
        rt.name as room_type,
        rt.base_price,
        COUNT(b.id) as booking_count,
        SUM(b.total_amount) as total_revenue,
        AVG(b.total_amount) as avg_booking_value
      FROM room_types rt
      LEFT JOIN bookings b ON rt.id = b.room_type_id
      GROUP BY rt.id, rt.name, rt.base_price
      ORDER BY total_revenue DESC
    `)
    console.log('Room type performance:', roomTypePerformance.rows)
    
    // Recent activity
    const recentActivity = await client.query(`
      SELECT 
        'booking' as type,
        booking_reference as reference,
        total_amount as amount,
        status,
        created_at
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '30 days'
      UNION ALL
      SELECT 
        'review' as type,
        CONCAT('Review #', id) as reference,
        NULL as amount,
        CASE WHEN is_published THEN 'published' ELSE 'pending' END as status,
        created_at
      FROM reviews
      WHERE created_at >= NOW() - INTERVAL '30 days'
      ORDER BY created_at DESC
      LIMIT 10
    `)
    console.log('Recent activity (last 30 days):', recentActivity.rows)
    
    client.release()
    console.log('\n✅ Complete database test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    console.error('❌ Error details:', error)
  } finally {
    await pool.end()
  }
}

testCompleteDatabase()
