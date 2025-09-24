// Setup users database
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://hoalucity:TicketX123@103.104.119.144:5432/hoalucity',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function setupUsersTable() {
  try {
    console.log('🔍 Connecting to database...')
    
    // Test connection
    const client = await pool.connect()
    console.log('✅ Database connected successfully')
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `)
    
    console.log('🔍 Users table exists:', tableCheck.rows[0].exists)
    
    if (!tableCheck.rows[0].exists) {
      console.log('📝 Creating users table...')
      
      // Create users table
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          full_name VARCHAR(100) NOT NULL,
          role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager')),
          password_hash VARCHAR(255) NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          last_login_at TIMESTAMP
        );
      `)
      
      console.log('✅ Users table created successfully')
      
      // Insert default users
      await client.query(`
        INSERT INTO users (username, email, full_name, role, password_hash, is_active) VALUES
        ('admin', 'admin@hoalucity.com', 'Quản trị viên', 'admin', 'admin123', true),
        ('manager1', 'manager1@hoalucity.com', 'Nguyễn Văn A', 'manager', 'manager123', true),
        ('manager2', 'manager2@hoalucity.com', 'Trần Thị B', 'manager', 'manager123', true);
      `)
      
      console.log('✅ Default users inserted successfully')
    } else {
      console.log('✅ Users table already exists')
      
      // Check if users exist
      const userCount = await client.query('SELECT COUNT(*) FROM users')
      console.log('🔍 Number of users:', userCount.rows[0].count)
      
      // List all users
      const users = await client.query('SELECT id, username, email, full_name, role FROM users')
      console.log('🔍 Users in database:', users.rows)
    }
    
    client.release()
    await pool.end()
    
  } catch (error) {
    console.error('❌ Error setting up users table:', error)
    console.error('❌ Error details:', error.message)
    process.exit(1)
  }
}

setupUsersTable()
