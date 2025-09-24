const { Pool } = require('pg')

async function checkTableStructure() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://hoalucity:TicketX123@103.104.119.144:5432/hoalucity',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })

  try {
    console.log('🔍 Checking database table structures...')
    
    const client = await pool.connect()
    console.log('✅ Database connection successful!')
    
    // Check all table structures
    const tables = ['users', 'room_types', 'rooms', 'customers', 'bookings', 'services', 'reviews', 'promotions', 'system_settings']
    
    for (const tableName of tables) {
      console.log(`\n📋 TABLE: ${tableName.toUpperCase()}`)
      
      try {
        // Get table structure
        const structureResult = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `, [tableName])
        
        if (structureResult.rows.length > 0) {
          console.log('Columns:')
          structureResult.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
          })
          
          // Get row count
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`)
          console.log(`Total rows: ${countResult.rows[0].count}`)
          
          // Get sample data
          const sampleResult = await client.query(`SELECT * FROM ${tableName} LIMIT 3`)
          if (sampleResult.rows.length > 0) {
            console.log('Sample data:')
            sampleResult.rows.forEach((row, index) => {
              console.log(`  Row ${index + 1}:`, row)
            })
          }
        } else {
          console.log('❌ Table does not exist')
        }
        
      } catch (error) {
        console.log(`❌ Error checking table ${tableName}:`, error.message)
      }
    }
    
    client.release()
    console.log('\n✅ Table structure check completed!')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await pool.end()
  }
}

checkTableStructure()
