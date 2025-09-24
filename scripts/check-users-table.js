// Check if users table exists and create if needed
const { query } = require('../lib/database')

async function checkUsersTable() {
  try {
    console.log('🔍 Checking users table...')
    
    // Check if table exists
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `)
    
    console.log('Users table exists:', tableCheck.rows[0].exists)
    
    if (!tableCheck.rows[0].exists) {
      console.log('📝 Creating users table...')
      
      // Create users table
      await query(`
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
      await query(`
        INSERT INTO users (username, email, full_name, role, password_hash, is_active) VALUES
        ('admin', 'admin@hoalucity.com', 'Quản trị viên', 'admin', 'admin123', true),
        ('manager1', 'manager1@hoalucity.com', 'Nguyễn Văn A', 'manager', 'manager123', true),
        ('manager2', 'manager2@hoalucity.com', 'Trần Thị B', 'manager', 'manager123', true)
        ON CONFLICT (username) DO NOTHING;
      `)
      
      console.log('✅ Default users inserted successfully')
    } else {
      console.log('✅ Users table already exists')
      
      // Check if users exist
      const userCount = await query('SELECT COUNT(*) FROM users')
      console.log('Number of users:', userCount.rows[0].count)
    }
    
  } catch (error) {
    console.error('❌ Error checking users table:', error)
  }
}

checkUsersTable()
