import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')
    
    let currentMonth: number
    let currentYear: number
    
    if (monthParam) {
      const [year, month] = monthParam.split('-').map(Number)
      currentYear = year
      currentMonth = month
    } else {
      // Get current month and year
      const now = new Date()
      currentMonth = now.getMonth() + 1
      currentYear = now.getFullYear()
    }
    
    // Monthly revenue
    const revenueResult = await query(`
      SELECT COALESCE(SUM(total_amount), 0) as monthly_revenue
      FROM bookings 
      WHERE EXTRACT(MONTH FROM created_at) = $1 
      AND EXTRACT(YEAR FROM created_at) = $2
      AND status != 'cancelled'
    `, [currentMonth, currentYear])
    
    // New bookings this month
    const bookingsResult = await query(`
      SELECT COUNT(*) as new_bookings
      FROM bookings 
      WHERE EXTRACT(MONTH FROM created_at) = $1 
      AND EXTRACT(YEAR FROM created_at) = $2
    `, [currentMonth, currentYear])
    
    // Occupancy rate (simplified calculation)
    const occupancyResult = await query(`
      SELECT 
        COUNT(CASE WHEN status IN ('confirmed', 'checked_out') THEN 1 END) as occupied_rooms,
        COUNT(*) as total_rooms
      FROM bookings
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `)
    
    // New customers this month
    const customersResult = await query(`
      SELECT COUNT(*) as new_customers
      FROM customers 
      WHERE EXTRACT(MONTH FROM created_at) = $1 
      AND EXTRACT(YEAR FROM created_at) = $2
    `, [currentMonth, currentYear])
    
    const stats = {
      monthlyRevenue: parseInt(revenueResult.rows[0]?.monthly_revenue || '0'),
      newBookings: parseInt(bookingsResult.rows[0]?.new_bookings || '0'),
      occupancyRate: occupancyResult.rows[0]?.total_rooms > 0 
        ? Math.round((occupancyResult.rows[0].occupied_rooms / occupancyResult.rows[0].total_rooms) * 100)
        : 0,
      newCustomers: parseInt(customersResult.rows[0]?.new_customers || '0')
    }
    
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
