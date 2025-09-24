const { Pool } = require('pg')

async function testDatabaseConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://hoalucity:TicketX123@103.104.119.144:5432/hoalucity',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })

  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    const client = await pool.connect()
    console.log('✅ Database connection successful!')
    
    // Test all tables and their data
    console.log('\n📊 Checking all tables and data...')
    
    // 1. Users table
    console.log('\n👥 USERS TABLE:')
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users')
    console.log(`Total users: ${usersResult.rows[0].count}`)
    
    const usersData = await client.query(`
      SELECT id, username, email, full_name, role, is_active, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `)
    console.log('Recent users:', usersData.rows)
    
    // 2. Room Types table
    console.log('\n🏨 ROOM TYPES TABLE:')
    const roomTypesResult = await client.query('SELECT COUNT(*) as count FROM room_types')
    console.log(`Total room types: ${roomTypesResult.rows[0].count}`)
    
    const roomTypesData = await client.query(`
      SELECT id, name, base_price, capacity, is_published, created_at 
      FROM room_types 
      ORDER BY created_at DESC 
      LIMIT 5
    `)
    console.log('Room types:', roomTypesData.rows)
    
    // 3. Rooms table
    console.log('\n🚪 ROOMS TABLE:')
    const roomsResult = await client.query('SELECT COUNT(*) as count FROM rooms')
    console.log(`Total rooms: ${roomsResult.rows[0].count}`)
    
    const roomsData = await client.query(`
      SELECT id, room_number, room_type_id, status, created_at 
      FROM rooms 
      ORDER BY created_at DESC 
      LIMIT 5
    `)
    console.log('Rooms:', roomsData.rows)
    
    // 4. Customers table
    console.log('\n👤 CUSTOMERS TABLE:')
    const customersResult = await client.query('SELECT COUNT(*) as count FROM customers')
    console.log(`Total customers: ${customersResult.rows[0].count}`)
    
    const customersData = await client.query(`
      SELECT id, full_name, email, phone, created_at, last_booking_at, total_spent 
      FROM customers 
      ORDER BY created_at DESC 
      LIMIT 5
    `)
    console.log('Recent customers:', customersData.rows)
    
    // 5. Bookings table
    console.log('\n📋 BOOKINGS TABLE:')
    const bookingsResult = await client.query('SELECT COUNT(*) as count FROM bookings')
    console.log(`Total bookings: ${bookingsResult.rows[0].count}`)
    
    const bookingsData = await client.query(`
      SELECT id, customer_id, check_in, check_out, status, total_amount, created_at 
      FROM bookings 
      ORDER BY created_at DESC 
      LIMIT 5
    `)
    console.log('Recent bookings:', bookingsData.rows)
    
    // 6. Services table
    console.log('\n🛎️ SERVICES TABLE:')
    const servicesResult = await client.query('SELECT COUNT(*) as count FROM services')
    console.log(`Total services: ${servicesResult.rows[0].count}`)
    
    const servicesData = await client.query(`
      SELECT id, name, price, is_available, created_at 
      FROM services 
      ORDER BY created_at DESC 
      LIMIT 5
    `)
    console.log('Services:', servicesData.rows)
    
    // 7. Reviews table
    console.log('\n⭐ REVIEWS TABLE:')
    const reviewsResult = await client.query('SELECT COUNT(*) as count FROM reviews')
    console.log(`Total reviews: ${reviewsResult.rows[0].count}`)
    
    const reviewsData = await client.query(`
      SELECT id, customer_id, room_type_id, rating, comment, created_at 
      FROM reviews 
      ORDER BY created_at DESC 
      LIMIT 5
    `)
    console.log('Recent reviews:', reviewsData.rows)
    
    // 8. Promotions table
    console.log('\n🎁 PROMOTIONS TABLE:')
    const promotionsResult = await client.query('SELECT COUNT(*) as count FROM promotions')
    console.log(`Total promotions: ${promotionsResult.rows[0].count}`)
    
    const promotionsData = await client.query(`
      SELECT id, code, name, discount_percent, is_active, created_at 
      FROM promotions 
      ORDER BY created_at DESC 
      LIMIT 5
    `)
    console.log('Promotions:', promotionsData.rows)
    
    // 9. System Settings table
    console.log('\n⚙️ SYSTEM SETTINGS TABLE:')
    const settingsResult = await client.query('SELECT COUNT(*) as count FROM system_settings')
    console.log(`Total settings: ${settingsResult.rows[0].count}`)
    
    const settingsData = await client.query(`
      SELECT key, value, description, updated_at 
      FROM system_settings 
      ORDER BY updated_at DESC 
      LIMIT 5
    `)
    console.log('System settings:', settingsData.rows)
    
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
      LIMIT 6
    `)
    console.log('Revenue by month:', revenueByMonth.rows)
    
    // Room occupancy
    const roomOccupancy = await client.query(`
      SELECT 
        r.room_number,
        rt.name as room_type,
        r.status,
        COUNT(b.id) as booking_count
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN bookings b ON r.id = b.room_id
      GROUP BY r.id, r.room_number, rt.name, r.status
      ORDER BY booking_count DESC
      LIMIT 10
    `)
    console.log('Room occupancy:', roomOccupancy.rows)
    
    // Customer statistics
    const customerStats = await client.query(`
      SELECT 
        c.full_name,
        c.email,
        COUNT(b.id) as total_bookings,
        SUM(b.total_amount) as total_spent,
        MAX(b.created_at) as last_booking
      FROM customers c
      LEFT JOIN bookings b ON c.id = b.customer_id
      GROUP BY c.id, c.full_name, c.email
      HAVING COUNT(b.id) > 0
      ORDER BY total_spent DESC
      LIMIT 5
    `)
    console.log('Top customers:', customerStats.rows)
    
    client.release()
    console.log('\n✅ All database tests completed successfully!')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('❌ Error details:', error)
  } finally {
    await pool.end()
  }
}

testDatabaseConnection()
