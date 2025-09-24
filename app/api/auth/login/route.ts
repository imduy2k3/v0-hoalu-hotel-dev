import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { usernameOrEmail, password } = await request.json()
    
    // Find user by username or email
    const userResult = await query(`
      SELECT id, username, email, full_name, role, is_active, 
             created_at, updated_at, last_login_at
      FROM users 
      WHERE (username = $1 OR email = $1) AND password_hash = $2 AND is_active = true
    `, [usernameOrEmail, password])
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    const user = userResult.rows[0]
    
    // Update last login time
    await query(`
      UPDATE users 
      SET last_login_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `, [user.id])
    
    // Return user data
    const userData = {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLoginAt: new Date().toISOString()
    }
    
    return NextResponse.json(userData)
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
