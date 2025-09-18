import { query } from './database'
import type { 
  DatabaseRoomType, 
  DatabaseRoom, 
  DatabaseCustomer, 
  DatabaseBooking,
  DatabaseService,
  DatabasePromotion,
  DatabaseReview,
  DatabasePayment,
  DatabaseStaff,
  DatabaseSystemSetting
} from './database-models'

// Room Types Queries
export const getRoomTypes = async (): Promise<DatabaseRoomType[]> => {
  const result = await query(`
    SELECT * FROM room_types 
    WHERE is_active = true 
    ORDER BY base_price ASC
  `)
  return result.rows
}

export const getRoomTypeById = async (id: number): Promise<DatabaseRoomType | null> => {
  const result = await query('SELECT * FROM room_types WHERE id = $1 AND is_active = true', [id])
  return result.rows[0] || null
}

export const getRoomTypeBySlug = async (slug: string): Promise<DatabaseRoomType | null> => {
  // Since the database doesn't have a slug field, we'll use name matching
  const result = await query(`
    SELECT * FROM room_types 
    WHERE LOWER(REPLACE(name, ' ', '-')) = $1 AND is_active = true
  `, [slug])
  return result.rows[0] || null
}

// Rooms Queries
export const getRooms = async (): Promise<DatabaseRoom[]> => {
  const result = await query(`
    SELECT r.*, rt.name as room_type_name 
    FROM rooms r 
    JOIN room_types rt ON r.room_type_id = rt.id 
    ORDER BY r.floor, r.room_number
  `)
  return result.rows
}

export const getRoomsByType = async (roomTypeId: number): Promise<DatabaseRoom[]> => {
  const result = await query(`
    SELECT * FROM rooms 
    WHERE room_type_id = $1 
    ORDER BY room_number
  `, [roomTypeId])
  return result.rows
}

export const getAvailableRooms = async (checkIn: string, checkOut: string, roomTypeId?: number): Promise<DatabaseRoom[]> => {
  let queryText = `
    SELECT DISTINCT r.* 
    FROM rooms r
    WHERE r.status = 'available'
    AND r.id NOT IN (
      SELECT ra.room_id 
      FROM room_assignments ra
      WHERE (ra.check_in_date <= $2 AND ra.check_out_date >= $1)
      AND ra.status IN ('assigned', 'checked_in')
    )
  `
  
  const params = [checkIn, checkOut]
  
  if (roomTypeId) {
    queryText += ' AND r.room_type_id = $3'
    params.push(roomTypeId.toString())
  }
  
  queryText += ' ORDER BY r.room_number'
  
  const result = await query(queryText, params)
  return result.rows
}

// Customers Queries
export const getCustomers = async (): Promise<DatabaseCustomer[]> => {
  const result = await query(`
    SELECT * FROM customers 
    ORDER BY created_at DESC
  `)
  return result.rows
}

export const getCustomerById = async (id: number): Promise<DatabaseCustomer | null> => {
  const result = await query('SELECT * FROM customers WHERE id = $1', [id])
  return result.rows[0] || null
}

export const getCustomerByEmail = async (email: string): Promise<DatabaseCustomer | null> => {
  const result = await query('SELECT * FROM customers WHERE email = $1', [email])
  return result.rows[0] || null
}

export const createCustomer = async (customer: Partial<DatabaseCustomer>): Promise<DatabaseCustomer> => {
  const result = await query(`
    INSERT INTO customers (first_name, last_name, email, phone, nationality, customer_type)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [
    customer.first_name,
    customer.last_name,
    customer.email,
    customer.phone,
    customer.nationality || 'Vietnam',
    customer.customer_type || 'regular'
  ])
  return result.rows[0]
}

// Bookings Queries
export const getBookings = async (): Promise<DatabaseBooking[]> => {
  const result = await query(`
    SELECT b.*, c.first_name, c.last_name, c.email, rt.name as room_type_name
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    JOIN room_types rt ON b.room_type_id = rt.id
    ORDER BY b.created_at DESC
  `)
  return result.rows
}

export const getBookingById = async (id: number): Promise<DatabaseBooking | null> => {
  const result = await query(`
    SELECT b.*, c.first_name, c.last_name, c.email, rt.name as room_type_name
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    JOIN room_types rt ON b.room_type_id = rt.id
    WHERE b.id = $1
  `, [id])
  return result.rows[0] || null
}

export const getBookingByReference = async (reference: string): Promise<DatabaseBooking | null> => {
  const result = await query(`
    SELECT b.*, c.first_name, c.last_name, c.email, rt.name as room_type_name
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    JOIN room_types rt ON b.room_type_id = rt.id
    WHERE b.booking_reference = $1
  `, [reference])
  return result.rows[0] || null
}

export const createBooking = async (booking: Partial<DatabaseBooking>): Promise<DatabaseBooking> => {
  // Generate booking reference
  const bookingRef = `BK${new Date().getFullYear()}${String(Date.now()).slice(-6)}`
  
  const result = await query(`
    INSERT INTO bookings (
      booking_reference, customer_id, room_type_id, check_in_date, check_out_date,
      adults, children, rooms_count, total_nights, base_amount, discount_amount,
      tax_amount, total_amount, status, payment_status, special_requests, booking_source
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    RETURNING *
  `, [
    bookingRef,
    booking.customer_id,
    booking.room_type_id,
    booking.check_in_date,
    booking.check_out_date,
    booking.adults || 1,
    booking.children || 0,
    booking.rooms_count || 1,
    booking.total_nights,
    booking.base_amount,
    booking.discount_amount || 0,
    booking.tax_amount || 0,
    booking.total_amount,
    booking.status || 'pending',
    booking.payment_status || 'pending',
    booking.special_requests,
    booking.booking_source || 'website'
  ])
  return result.rows[0]
}

// Services Queries
export const getServices = async (): Promise<DatabaseService[]> => {
  const result = await query(`
    SELECT * FROM services 
    WHERE is_active = true 
    ORDER BY category, name
  `)
  return result.rows
}

// Promotions Queries
export const getPromotions = async (): Promise<DatabasePromotion[]> => {
  const result = await query(`
    SELECT * FROM promotions 
    WHERE is_active = true 
    AND valid_from <= CURRENT_DATE 
    AND valid_to >= CURRENT_DATE
    ORDER BY created_at DESC
  `)
  return result.rows
}

export const getPromotionByCode = async (code: string): Promise<DatabasePromotion | null> => {
  const result = await query(`
    SELECT * FROM promotions 
    WHERE code = $1 
    AND is_active = true 
    AND valid_from <= CURRENT_DATE 
    AND valid_to >= CURRENT_DATE
  `, [code])
  return result.rows[0] || null
}

// Reviews Queries
export const getReviews = async (): Promise<DatabaseReview[]> => {
  const result = await query(`
    SELECT r.*, c.first_name, c.last_name, b.booking_reference
    FROM reviews r
    JOIN customers c ON r.customer_id = c.id
    JOIN bookings b ON r.booking_id = b.id
    WHERE r.is_published = true
    ORDER BY r.created_at DESC
  `)
  return result.rows
}

export const getReviewsByRoomType = async (roomTypeId: number): Promise<DatabaseReview[]> => {
  const result = await query(`
    SELECT r.*, c.first_name, c.last_name, b.booking_reference
    FROM reviews r
    JOIN customers c ON r.customer_id = c.id
    JOIN bookings b ON r.booking_id = b.id
    WHERE r.is_published = true AND b.room_type_id = $1
    ORDER BY r.created_at DESC
  `, [roomTypeId])
  return result.rows
}

// System Settings Queries
export const getSystemSettings = async (): Promise<DatabaseSystemSetting[]> => {
  const result = await query(`
    SELECT * FROM system_settings 
    WHERE is_public = true
    ORDER BY category, setting_key
  `)
  return result.rows
}

export const getSystemSetting = async (key: string): Promise<string | null> => {
  const result = await query(`
    SELECT setting_value FROM system_settings 
    WHERE setting_key = $1 AND is_public = true
  `, [key])
  return result.rows[0]?.setting_value || null
}

// Analytics Queries
export const getMonthlyRevenue = async (): Promise<any[]> => {
  const result = await query(`
    SELECT * FROM monthly_revenue 
    ORDER BY year DESC, month DESC
  `)
  return result.rows
}

export const getRoomStatusView = async (): Promise<any[]> => {
  const result = await query(`
    SELECT * FROM room_status_view 
    ORDER BY floor, room_number
  `)
  return result.rows
}

export const getRoomTypeRatings = async (): Promise<any[]> => {
  const result = await query(`
    SELECT * FROM room_type_ratings 
    ORDER BY average_rating DESC
  `)
  return result.rows
}
