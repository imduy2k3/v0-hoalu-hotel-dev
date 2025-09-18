// Database models that match the PostgreSQL schema
export interface DatabaseRoomType {
  id: number
  name: string
  name_en: string
  description: string | null
  description_en: string | null
  base_price: number
  max_guests: number
  size_sqm: number | null
  bed_type: string | null
  amenities: string[] | null
  features: string[] | null
  images: string[] | null
  is_active: boolean
  created_at: string
  updated_at: string
  image_url: string | null
}

export interface DatabaseRoom {
  id: number
  room_number: string
  room_type_id: number
  floor: number
  status: 'available' | 'occupied' | 'maintenance' | 'out_of_order'
  view_type: string | null
  special_features: any | null
  last_maintenance: string | null
  created_at: string
  updated_at: string
  image_url: string | null
}

export interface DatabaseCustomer {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  date_of_birth: string | null
  nationality: string | null
  id_number: string | null
  address: string | null
  city: string | null
  country: string | null
  loyalty_points: number
  customer_type: 'regular' | 'vip' | 'corporate'
  created_at: string
  updated_at: string
}

export interface DatabaseBooking {
  id: number
  booking_reference: string
  customer_id: number
  room_type_id: number
  check_in_date: string
  check_out_date: string
  adults: number
  children: number
  rooms_count: number
  total_nights: number
  base_amount: number
  discount_amount: number
  tax_amount: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
  special_requests: string | null
  booking_source: string
  created_at: string
  updated_at: string
}

export interface DatabaseService {
  id: number
  name: string
  name_en: string
  description: string | null
  category: string | null
  price: number | null
  unit: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DatabasePromotion {
  id: number
  code: string
  name: string
  description: string | null
  type: string
  value: number
  min_nights: number
  min_amount: number
  max_discount: number | null
  valid_from: string
  valid_to: string
  usage_limit: number | null
  used_count: number
  applicable_room_types: number[] | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseReview {
  id: number
  booking_id: number
  customer_id: number
  rating: number
  title: string | null
  comment: string | null
  room_rating: number | null
  service_rating: number | null
  cleanliness_rating: number | null
  location_rating: number | null
  value_rating: number | null
  is_verified: boolean
  is_published: boolean
  response: string | null
  responded_at: string | null
  created_at: string
}

export interface DatabasePayment {
  id: number
  booking_id: number
  payment_method: string
  amount: number
  currency: string
  transaction_id: string | null
  payment_gateway: string | null
  status: string
  payment_date: string | null
  notes: string | null
  created_at: string
}

export interface DatabaseStaff {
  id: number
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  position: string | null
  department: string | null
  hire_date: string | null
  salary: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseSystemSetting {
  id: number
  setting_key: string
  setting_value: string | null
  description: string | null
  category: string | null
  is_public: boolean
  updated_at: string
}
