const { Pool } = require('pg')

async function mergeDuplicateCustomers() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://hoalucity:TicketX123@103.104.119.144:5432/hoalucity',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })

  try {
    console.log('🔍 Finding duplicate customers with same phone but different emails...')
    
    const client = await pool.connect()
    console.log('✅ Database connection successful!')
    
    // 1. Find customers with same phone but different emails
    const duplicateQuery = `
      SELECT 
        phone,
        COUNT(*) as customer_count,
        ARRAY_AGG(id ORDER BY created_at DESC) as customer_ids,
        ARRAY_AGG(email ORDER BY created_at DESC) as emails,
        ARRAY_AGG(first_name ORDER BY created_at DESC) as first_names,
        ARRAY_AGG(last_name ORDER BY created_at DESC) as last_names,
        ARRAY_AGG(created_at ORDER BY created_at DESC) as created_dates
      FROM customers 
      WHERE phone IS NOT NULL AND phone != ''
      GROUP BY phone 
      HAVING COUNT(*) > 1
      ORDER BY customer_count DESC
    `
    
    const duplicates = await client.query(duplicateQuery)
    console.log(`\n📊 Found ${duplicates.rows.length} phone numbers with duplicate customers:`)
    
    if (duplicates.rows.length === 0) {
      console.log('✅ No duplicate customers found!')
      return
    }
    
    // Display duplicates before merging
    duplicates.rows.forEach((dup, index) => {
      console.log(`\n${index + 1}. Phone: ${dup.phone}`)
      console.log(`   Customer count: ${dup.customer_count}`)
      console.log(`   Customer IDs: ${dup.customer_ids.join(', ')}`)
      console.log(`   Emails: ${dup.emails.join(', ')}`)
      console.log(`   Names: ${dup.first_names.map((f, i) => `${f} ${dup.last_names[i]}`).join(', ')}`)
    })
    
    // 2. Start transaction for merging
    await client.query('BEGIN')
    console.log('\n🔄 Starting merge process...')
    
    let totalMerged = 0
    let totalBookingsMoved = 0
    
    for (const dup of duplicates.rows) {
      const customerIds = dup.customer_ids
      const emails = dup.emails
      const firstNames = dup.first_names
      const lastNames = dup.last_names
      const createdDates = dup.created_dates
      
      // Keep the most recent customer (first in array due to ORDER BY created_at DESC)
      const keepCustomerId = customerIds[0]
      const keepEmail = emails[0]
      const keepFirstName = firstNames[0]
      const keepLastName = lastNames[0]
      
      console.log(`\n📞 Processing phone: ${dup.phone}`)
      console.log(`   Keeping customer ID: ${keepCustomerId} (${keepFirstName} ${keepLastName} - ${keepEmail})`)
      
      // Merge other customers into the kept one
      for (let i = 1; i < customerIds.length; i++) {
        const mergeCustomerId = customerIds[i]
        const mergeEmail = emails[i]
        const mergeFirstName = firstNames[i]
        const mergeLastName = lastNames[i]
        
        console.log(`   Merging customer ID: ${mergeCustomerId} (${mergeFirstName} ${mergeLastName} - ${mergeEmail})`)
        
        // Get all bookings for the customer to be merged
        const bookingsQuery = `
          SELECT id, booking_reference, total_amount, created_at 
          FROM bookings 
          WHERE customer_id = $1
        `
        const bookings = await client.query(bookingsQuery, [mergeCustomerId])
        
        if (bookings.rows.length > 0) {
          console.log(`     Moving ${bookings.rows.length} bookings to customer ${keepCustomerId}`)
          
          // Update bookings to point to the kept customer
          await client.query(`
            UPDATE bookings 
            SET customer_id = $1, updated_at = NOW()
            WHERE customer_id = $2
          `, [keepCustomerId, mergeCustomerId])
          
          totalBookingsMoved += bookings.rows.length
        }
        
        // Get all reviews for the customer to be merged
        const reviewsQuery = `
          SELECT id, rating, created_at 
          FROM reviews 
          WHERE customer_id = $1
        `
        const reviews = await client.query(reviewsQuery, [mergeCustomerId])
        
        if (reviews.rows.length > 0) {
          console.log(`     Moving ${reviews.rows.length} reviews to customer ${keepCustomerId}`)
          
          // Update reviews to point to the kept customer
          await client.query(`
            UPDATE reviews 
            SET customer_id = $1
            WHERE customer_id = $2
          `, [keepCustomerId, mergeCustomerId])
        }
        
        // Delete the duplicate customer
        await client.query('DELETE FROM customers WHERE id = $1', [mergeCustomerId])
        console.log(`     Deleted duplicate customer ID: ${mergeCustomerId}`)
        
        totalMerged++
      }
      
      // Update the kept customer with the most recent email if different
      if (emails[0] !== emails[1]) {
        console.log(`   Updating email from ${emails[1]} to ${emails[0]} (most recent)`)
        await client.query(`
          UPDATE customers 
          SET email = $1, updated_at = NOW()
          WHERE id = $2
        `, [emails[0], keepCustomerId])
      }
    }
    
    // Commit transaction
    await client.query('COMMIT')
    console.log('\n✅ Merge process completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Total customers merged: ${totalMerged}`)
    console.log(`   - Total bookings moved: ${totalBookingsMoved}`)
    console.log(`   - Phone numbers processed: ${duplicates.rows.length}`)
    
    // 3. Verify results
    console.log('\n🔍 Verifying results...')
    
    // Check for remaining duplicates
    const remainingDuplicates = await client.query(duplicateQuery)
    console.log(`   Remaining duplicates: ${remainingDuplicates.rows.length}`)
    
    // Show final customer count
    const finalCustomerCount = await client.query('SELECT COUNT(*) as count FROM customers')
    console.log(`   Final customer count: ${finalCustomerCount.rows[0].count}`)
    
    // Show customers by phone
    const customersByPhone = await client.query(`
      SELECT 
        phone,
        COUNT(*) as count,
        ARRAY_AGG(CONCAT(first_name, ' ', last_name, ' (', email, ')')) as customer_info
      FROM customers 
      WHERE phone IS NOT NULL AND phone != ''
      GROUP BY phone 
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `)
    
    if (customersByPhone.rows.length > 0) {
      console.log('\n⚠️  Remaining customers with same phone:')
      customersByPhone.rows.forEach(customer => {
        console.log(`   Phone: ${customer.phone} (${customer.count} customers)`)
        console.log(`   Customers: ${customer.customer_info.join(', ')}`)
      })
    } else {
      console.log('✅ No remaining duplicate customers found!')
    }
    
    client.release()
    console.log('\n✅ Customer merge process completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during merge process:', error.message)
    console.error('❌ Error details:', error)
    
    // Rollback transaction if it exists
    try {
      await client.query('ROLLBACK')
      console.log('🔄 Transaction rolled back')
    } catch (rollbackError) {
      console.error('❌ Rollback failed:', rollbackError.message)
    }
  } finally {
    await pool.end()
  }
}

mergeDuplicateCustomers()
