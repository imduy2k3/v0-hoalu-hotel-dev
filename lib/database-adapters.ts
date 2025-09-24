import type { 
  DatabaseRoomType, 
  DatabaseRoom, 
  DatabaseCustomer, 
  DatabaseBooking,
  DatabaseService,
  DatabasePromotion,
  DatabaseReview
} from './database-models'
import type { RoomType, Room, Customer, Booking, Amenity } from './types'

// Convert database room type to application room type
export const adaptRoomType = (dbRoomType: DatabaseRoomType): RoomType => {
  return {
    id: dbRoomType.id.toString(),
    name: dbRoomType.name,
    slug: dbRoomType.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    basePrice: Number(dbRoomType.base_price),
    capacity: dbRoomType.max_guests,
    sizeSqm: dbRoomType.size_sqm || 0,
    bedType: (dbRoomType.bed_type as "Queen" | "King" | "Twin") || "Twin",
    shortDesc: dbRoomType.description || dbRoomType.description_en || "",
    longDesc: dbRoomType.description || dbRoomType.description_en || "",
    amenities: (dbRoomType.amenities as Amenity[]) || [],
    policies: "Hủy miễn phí 48h trước check-in. Check-in 14:00, Check-out 12:00.",
    images: dbRoomType.images || (dbRoomType.image_url ? [dbRoomType.image_url] : []),
    isPublished: dbRoomType.is_active,
    updatedAt: dbRoomType.updated_at
  }
}

// Convert database room to application room
export const adaptRoom = (dbRoom: DatabaseRoom): Room => {
  return {
    id: dbRoom.id.toString(),
    roomNumber: dbRoom.room_number,
    floor: dbRoom.floor,
    roomTypeId: dbRoom.room_type_id.toString(),
    status: mapRoomStatus(dbRoom.status),
    notes: dbRoom.special_features ? JSON.stringify(dbRoom.special_features) : undefined,
    updatedAt: dbRoom.updated_at
  }
}

// Convert database customer to application customer
export const adaptCustomer = (dbCustomer: DatabaseCustomer): Customer => {
  return {
    id: dbCustomer.id.toString(),
    fullName: `${dbCustomer.first_name} ${dbCustomer.last_name}`,
    email: dbCustomer.email,
    phone: dbCustomer.phone || "",
    createdAt: dbCustomer.created_at,
    lastBookingAt: undefined, // Will be populated separately if needed
    totalSpent: 0 // Will be calculated separately if needed
  }
}

// Convert database booking to application booking
export const adaptBooking = (dbBooking: DatabaseBooking): Booking => {
  return {
    id: dbBooking.booking_reference,
    customerId: dbBooking.customer_id.toString(),
    checkIn: dbBooking.check_in_date,
    checkOut: dbBooking.check_out_date,
    nights: dbBooking.total_nights,
    roomTypeId: dbBooking.room_type_id.toString(),
    roomsCount: dbBooking.rooms_count,
    guestsAdult: dbBooking.adults,
    guestsChild: dbBooking.children,
    totalAmount: Number(dbBooking.total_amount),
    status: mapBookingStatus(dbBooking.status),
    note: dbBooking.special_requests || undefined,
    createdAt: dbBooking.created_at,
    updatedAt: dbBooking.updated_at
  }
}

// Convert database review to application review
export const adaptReview = (dbReview: DatabaseReview) => {
  return {
    id: dbReview.id.toString(),
    bookingId: dbReview.booking_id.toString(),
    customerId: dbReview.customer_id.toString(),
    rating: dbReview.rating,
    title: dbReview.title || "",
    comment: dbReview.comment || "",
    roomRating: dbReview.room_rating || dbReview.rating,
    serviceRating: dbReview.service_rating || dbReview.rating,
    cleanlinessRating: dbReview.cleanliness_rating || dbReview.rating,
    locationRating: dbReview.location_rating || dbReview.rating,
    valueRating: dbReview.value_rating || dbReview.rating,
    isVerified: dbReview.is_verified,
    isPublished: dbReview.is_published,
    response: dbReview.response || undefined,
    respondedAt: dbReview.responded_at || undefined,
    createdAt: dbReview.created_at
  }
}

// Helper function to map database room status to application room status
const mapRoomStatus = (dbStatus: string): "Khả dụng" | "Đang sử dụng" | "Đang bảo trì" => {
  switch (dbStatus) {
    case 'available':
      return 'Khả dụng'
    case 'occupied':
      return 'Đang sử dụng'
    case 'maintenance':
      return 'Đang bảo trì'
    case 'out_of_order':
      return 'Đang bảo trì'
    default:
      return 'Khả dụng'
  }
}

// Helper function to map database booking status to application booking status
const mapBookingStatus = (dbStatus: string): "Chờ xác nhận" | "Đã xác nhận" | "Đã nhận phòng" | "Hoàn thành" | "Đã hủy" => {
  switch (dbStatus) {
    case 'pending':
      return 'Chờ xác nhận'
    case 'confirmed':
      return 'Đã xác nhận'
    case 'checked_in':
      return 'Đã nhận phòng'
    case 'checked_out':
      return 'Hoàn thành'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return 'Chờ xác nhận'
  }
}

// Helper function to map application room status to database room status
export const mapToDatabaseRoomStatus = (status: "Khả dụng" | "Đang sử dụng" | "Đang bảo trì"): string => {
  switch (status) {
    case 'Khả dụng':
      return 'available'
    case 'Đang sử dụng':
      return 'occupied'
    case 'Đang bảo trì':
      return 'maintenance'
    default:
      return 'available'
  }
}

// Helper function to map application booking status to database booking status
export const mapToDatabaseBookingStatus = (status: "Chờ xác nhận" | "Đã xác nhận" | "Đã nhận phòng" | "Hoàn thành" | "Đã hủy"): string => {
  switch (status) {
    case 'Chờ xác nhận':
      return 'pending'
    case 'Đã xác nhận':
      return 'confirmed'
    case 'Đã nhận phòng':
      return 'checked_in'
    case 'Hoàn thành':
      return 'checked_out'
    case 'Đã hủy':
      return 'cancelled'
    default:
      return 'pending'
  }
}
