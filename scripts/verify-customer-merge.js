const { Pool } = require('pg')

async function verifyCustomerMerge() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://hoalucity:TicketX123@103.104.119.144:5432/hoalucity',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })

  try {
    console.log('🔍 Verifying customer merge results...')
    
    const client = await pool.connect()
    console.log('✅ Database connection successful!')
    
    // 1. Check final customer count
    const customerCount = await client.query('SELECT COUNT(*) as count FROM customers')
    console.log(`\n👤 Total customers: ${customerCount.rows[0].count}`)
    
    // 2. Show all customers
    const allCustomers = await client.query(`
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        phone, 
        customer_type,
        loyalty_points,
        created_at,
        updated_at
      FROM customers 
      ORDER BY created_at DESC
    `)
    
    console.log('\n📋 All customers:')
    allCustomers.rows.forEach((customer, index) => {
      console.log(`${index + 1}. ID: ${customer.id}`)
      console.log(`   Name: ${customer.first_name} ${customer.last_name}`)
      console.log(`   Email: ${customer.email}`)
      console.log(`   Phone: ${customer.phone}`)
      console.log(`   Type: ${customer.customer_type}`)
      console.log(`   Loyalty Points: ${customer.loyalty_points}`)
      console.log(`   Created: ${customer.created_at}`)
      console.log(`   Updated: ${customer.updated_at}`)
      console.log('')
    })
    
    // 3. Check for any remaining duplicates
    const duplicates = await client.query(`
      SELECT 
        phone,
        COUNT(*) as customer_count,
        ARRAY_AGG(id) as customer_ids,
        ARRAY_AGG(email) as emails,
        ARRAY_AGG(CONCAT(first_name, ' ', last_name)) as names
      FROM customers 
      WHERE phone IS NOT NULL AND phone != ''
      GROUP BY phone 
      HAVING COUNT(*) > 1
      ORDER BY customer_count DESC
    `)
    
    if (duplicates.rows.length > 0) {
      console.log('⚠️  Remaining duplicates found:')
      duplicates.rows.forEach(dup => {
        console.log(`   Phone: ${dup.phone} (${dup.customer_count} customers)`)
        console.log(`   IDs: ${dup.customer_ids.join(', ')}`)
        console.log(`   Emails: ${dup.emails.join(', ')}`)
        console.log(`   Names: ${dup.names.join(', ')}`)
        console.log('')
      })
    } else {
      console.log('✅ No remaining duplicates found!')
    }
    
    // 4. Check bookings for the merged customer
    const mergedCustomerBookings = await client.query(`
      SELECT 
        b.id,
        b.booking_reference,
        b.check_in_date,
        b.check_out_date,
        b.total_amount,
        b.status,
        b.created_at,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email,
        c.phone
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      WHERE c.phone = '0984821037'
      ORDER BY b.created_at DESC
    `)
    
    console.log(`\n📋 Bookings for merged customer (phone: 0984821037):`)
    console.log(`   Customer: ${mergedCustomerBookings.rows[0]?.customer_name || 'N/A'}`)
    console.log(`   Email: ${mergedCustomerBookings.rows[0]?.email || 'N/A'}`)
    console.log(`   Phone: ${mergedCustomerBookings.rows[0]?.phone || 'N/A'}`)
    console.log(`   Total bookings: ${mergedCustomerBookings.rows.length}`)
    
    if (mergedCustomerBookings.rows.length > 0) {
      mergedCustomerBookings.rows.forEach((booking, index) => {
        console.log(`   ${index + 1}. ${booking.booking_reference}`)
        console.log(`      Dates: ${booking.check_in_date} to ${booking.check_out_date}`)
        console.log(`      Amount: ${parseInt(booking.total_amount).toLocaleString()} VNĐ`)
        console.log(`      Status: ${booking.status}`)
        console.log(`      Created: ${booking.created_at}`)
        console.log('')
      })
    }
    
    // 5. Check reviews for the merged customer
    const mergedCustomerReviews = await client.query(`
      SELECT 
        r.id,
        r.rating,
        r.title,
        r.comment,
        r.created_at,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email
      FROM reviews r
      JOIN customers c ON r.customer_id = c.id
      WHERE c.phone = '0984821037'
      ORDER BY r.created_at DESC
    `)
    
    console.log(`\n⭐ Reviews for merged customer:`)
    console.log(`   Total reviews: ${mergedCustomerReviews.rows.length}`)
    
    if (mergedCustomerReviews.rows.length > 0) {
      mergedCustomerReviews.rows.forEach((review, index) => {
        console.log(`   ${index + 1}. Rating: ${review.rating}/5`)
        console.log(`      Title: ${review.title}`)
        console.log(`      Comment: ${review.comment}`)
        console.log(`      Created: ${review.created_at}`)
        console.log('')
      })
    }
    
    // 6. Summary statistics
    const summary = await client.query(`
      SELECT 
        COUNT(DISTINCT c.id) as total_customers,
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT r.id) as total_reviews,
        SUM(b.total_amount) as total_revenue,
        AVG(r.rating) as avg_rating
      FROM customers c
      LEFT JOIN bookings b ON c.id = b.customer_id
      LEFT JOIN reviews r ON c.id = r.customer_id
    `)
    
    console.log('\n📊 Summary Statistics:')
    console.log(`   Total customers: ${summary.rows[0].total_customers}`)
    console.log(`   Total bookings: ${summary.rows[0].total_bookings}`)
    console.log(`   Total reviews: ${summary.rows[0].total_reviews}`)
    console.log(`   Total revenue: ${parseInt(summary.rows[0].total_revenue || 0).toLocaleString()} VNĐ`)
    console.log(`   Average rating: ${summary.rows[0].avg_rating ? summary.rows[0].avg_rating.toFixed(1) : 'N/A'}`)
    
    client.release()
    console.log('\n✅ Customer merge verification completed!')
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message)
    console.error('❌ Error details:', error)
  } finally {
    await pool.end()
  }
}

verifyCustomerMerge()
