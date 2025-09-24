import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET() {
  // Note: In production, you should check admin permissions here
  // For now, the frontend handles the permission check
  try {
    const result = await query(`
      SELECT id, username, email, full_name, role, is_active, 
             created_at, updated_at, last_login_at
      FROM users
      ORDER BY created_at DESC
    `)
    
    const users = result.rows.map(row => ({
      id: row.id.toString(),
      username: row.username,
      email: row.email,
      fullName: row.full_name,
      role: row.role,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLoginAt: row.last_login_at
    }))
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Note: In production, you should check admin permissions here
  // For now, the frontend handles the permission check
  try {
    const { username, email, fullName, role, password, isActive } = await request.json()
    
    // Check if username or email already exists
    const existingUser = await query(`
      SELECT id FROM users WHERE username = $1 OR email = $2
    `, [username, email])
    
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password (in production, use bcrypt)
    const hashedPassword = password // In production, hash this
    
    // Create user
    const result = await query(`
      INSERT INTO users (username, email, full_name, role, password_hash, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, username, email, full_name, role, is_active, created_at, updated_at
    `, [username, email, fullName, role, hashedPassword, isActive])
    
    const user = result.rows[0]
    
    return NextResponse.json({
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
