import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Note: In production, you should check admin permissions here
  // For now, the frontend handles the permission check
  try {
    const userId = parseInt(params.id)
    const { username, email, fullName, role, password, isActive } = await request.json()
    
    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE id = $1', [userId])
    if (existingUser.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Check if username or email already exists (excluding current user)
    const duplicateUser = await query(`
      SELECT id FROM users WHERE (username = $1 OR email = $2) AND id != $3
    `, [username, email, userId])
    
    if (duplicateUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      )
    }
    
    // Update user
    let updateQuery = `
      UPDATE users 
      SET username = $1, email = $2, full_name = $3, role = $4, is_active = $5, updated_at = NOW()
    `
    const params_array = [username, email, fullName, role, isActive]
    
    // Only update password if provided
    if (password && password.trim() !== '') {
      updateQuery += ', password_hash = $6'
      params_array.push(password) // In production, hash this
    }
    
    updateQuery += ' WHERE id = $' + (params_array.length + 1)
    params_array.push(userId)
    
    await query(updateQuery, params_array)
    
    // Fetch updated user
    const result = await query(`
      SELECT id, username, email, full_name, role, is_active, 
             created_at, updated_at, last_login_at
      FROM users WHERE id = $1
    `, [userId])
    
    const user = result.rows[0]
    
    return NextResponse.json({
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLoginAt: user.last_login_at
    })
    
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    
    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE id = $1', [userId])
    if (existingUser.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Delete user
    await query('DELETE FROM users WHERE id = $1', [userId])
    
    return NextResponse.json({ message: 'User deleted successfully' })
    
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
