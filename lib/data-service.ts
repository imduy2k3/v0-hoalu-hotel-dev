import { 
  getRoomTypes, 
  getRoomTypeById, 
  getRoomTypeBySlug,
  updateRoomType,
  getRooms, 
  getRoomsByType,
  getAvailableRooms,
  getCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  getBookings,
  getBookingById,
  getBookingByReference,
  createBooking,
  getServices,
  getPromotions,
  getPromotionByCode,
  getReviews,
  getReviewsByRoomType,
  getSystemSettings,
  getSystemSetting,
  getMonthlyRevenue,
  getRoomStatusView,
  getRoomTypeRatings
} from './database-queries'
import { 
  adaptRoomType, 
  adaptRoom, 
  adaptCustomer, 
  adaptBooking, 
  adaptReview 
} from './database-adapters'
import type { RoomType, Room, Customer, Booking } from './types'

// Room Types Service
export const roomTypesService = {
  async getAll(): Promise<RoomType[]> {
    try {
      const dbRoomTypes = await getRoomTypes()
      return dbRoomTypes.map(adaptRoomType)
    } catch (error) {
      console.error('Error fetching room types:', error)
      return []
    }
  },

  async getById(id: string): Promise<RoomType | null> {
    try {
      const dbRoomType = await getRoomTypeById(parseInt(id))
      return dbRoomType ? adaptRoomType(dbRoomType) : null
    } catch (error) {
      console.error('Error fetching room type by id:', error)
      return null
    }
  },

  async getBySlug(slug: string): Promise<RoomType | null> {
    try {
      const dbRoomType = await getRoomTypeBySlug(slug)
      return dbRoomType ? adaptRoomType(dbRoomType) : null
    } catch (error) {
      console.error('Error fetching room type by slug:', error)
      return null
    }
  },

  async update(id: string, data: Partial<RoomType>): Promise<RoomType | null> {
    try {
      console.log('Updating room type:', id, data)
      // Convert RoomType data to DatabaseRoomType format
      const dbData = {
        name: data.name,
        base_price: data.basePrice,
        max_guests: data.capacity, // Map capacity to max_guests
        size_sqm: data.sizeSqm,
        bed_type: data.bedType,
        description: data.shortDesc, // Map shortDesc to description
        amenities: data.amenities,
        images: data.images,
      }
      const dbRoomType = await updateRoomType(parseInt(id), dbData)
      return dbRoomType ? adaptRoomType(dbRoomType) : null
    } catch (error) {
      console.error('Error updating room type:', error)
      return null
    }
  }
}

// Rooms Service
export const roomsService = {
  async getAll(): Promise<Room[]> {
    try {
      const dbRooms = await getRooms()
      return dbRooms.map(adaptRoom)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      return []
    }
  },

  async getByType(roomTypeId: string): Promise<Room[]> {
    try {
      const dbRooms = await getRoomsByType(parseInt(roomTypeId))
      return dbRooms.map(adaptRoom)
    } catch (error) {
      console.error('Error fetching rooms by type:', error)
      return []
    }
  },

  async getAvailable(checkIn: string, checkOut: string, roomTypeId?: string): Promise<Room[]> {
    try {
      const dbRooms = await getAvailableRooms(checkIn, checkOut, roomTypeId ? parseInt(roomTypeId) : undefined)
      return dbRooms.map(adaptRoom)
    } catch (error) {
      console.error('Error fetching available rooms:', error)
      return []
    }
  }
}

// Customers Service
export const customersService = {
  async getAll(): Promise<Customer[]> {
    try {
      const dbCustomers = await getCustomers()
      return dbCustomers.map(adaptCustomer)
    } catch (error) {
      console.error('Error fetching customers:', error)
      return []
    }
  },

  async getById(id: string): Promise<Customer | null> {
    try {
      const dbCustomer = await getCustomerById(parseInt(id))
      return dbCustomer ? adaptCustomer(dbCustomer) : null
    } catch (error) {
      console.error('Error fetching customer by id:', error)
      return null
    }
  },

  async getByEmail(email: string): Promise<Customer | null> {
    try {
      const dbCustomer = await getCustomerByEmail(email)
      return dbCustomer ? adaptCustomer(dbCustomer) : null
    } catch (error) {
      console.error('Error fetching customer by email:', error)
      return null
    }
  },

  async create(customerData: Partial<Customer>): Promise<Customer | null> {
    try {
      const [firstName, ...lastNameParts] = customerData.fullName?.split(' ') || ['', '']
      const lastName = lastNameParts.join(' ')
      
      const dbCustomer = await createCustomer({
        first_name: firstName,
        last_name: lastName,
        email: customerData.email || '',
        phone: customerData.phone,
        nationality: 'Vietnam',
        customer_type: 'regular'
      })
      
      return adaptCustomer(dbCustomer)
    } catch (error) {
      console.error('Error creating customer:', error)
      return null
    }
  }
}

// Bookings Service
export const bookingsService = {
  async getAll(): Promise<Booking[]> {
    try {
      const dbBookings = await getBookings()
      return dbBookings.map(adaptBooking)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return []
    }
  },

  async getById(id: string): Promise<Booking | null> {
    try {
      const dbBooking = await getBookingById(parseInt(id))
      return dbBooking ? adaptBooking(dbBooking) : null
    } catch (error) {
      console.error('Error fetching booking by id:', error)
      return null
    }
  },

  async getByReference(reference: string): Promise<Booking | null> {
    try {
      const dbBooking = await getBookingByReference(reference)
      return dbBooking ? adaptBooking(dbBooking) : null
    } catch (error) {
      console.error('Error fetching booking by reference:', error)
      return null
    }
  },

  async create(bookingData: Partial<Booking>): Promise<Booking | null> {
    try {
      const dbBooking = await createBooking({
        customer_id: parseInt(bookingData.customerId || '0'),
        room_type_id: parseInt(bookingData.roomTypeId || '0'),
        check_in_date: bookingData.checkIn || '',
        check_out_date: bookingData.checkOut || '',
        adults: bookingData.guestsAdult || 1,
        children: bookingData.guestsChild || 0,
        rooms_count: bookingData.roomsCount || 1,
        total_nights: bookingData.nights || 1,
        base_amount: bookingData.totalAmount || 0,
        discount_amount: 0,
        tax_amount: 0,
        total_amount: bookingData.totalAmount || 0,
        status: 'pending',
        payment_status: 'pending',
        special_requests: bookingData.note,
        booking_source: 'website'
      })
      
      return adaptBooking(dbBooking)
    } catch (error) {
      console.error('Error creating booking:', error)
      return null
    }
  }
}

// Services Service
export const servicesService = {
  async getAll() {
    try {
      return await getServices()
    } catch (error) {
      console.error('Error fetching services:', error)
      return []
    }
  }
}

// Promotions Service
export const promotionsService = {
  async getAll() {
    try {
      return await getPromotions()
    } catch (error) {
      console.error('Error fetching promotions:', error)
      return []
    }
  },

  async getByCode(code: string) {
    try {
      return await getPromotionByCode(code)
    } catch (error) {
      console.error('Error fetching promotion by code:', error)
      return null
    }
  }
}

// Reviews Service
export const reviewsService = {
  async getAll() {
    try {
      const dbReviews = await getReviews()
      return dbReviews.map(adaptReview)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return []
    }
  },

  async getByRoomType(roomTypeId: string) {
    try {
      const dbReviews = await getReviewsByRoomType(parseInt(roomTypeId))
      return dbReviews.map(adaptReview)
    } catch (error) {
      console.error('Error fetching reviews by room type:', error)
      return []
    }
  }
}

// System Settings Service
export const systemSettingsService = {
  async getAll() {
    try {
      return await getSystemSettings()
    } catch (error) {
      console.error('Error fetching system settings:', error)
      return []
    }
  },

  async get(key: string) {
    try {
      return await getSystemSetting(key)
    } catch (error) {
      console.error('Error fetching system setting:', error)
      return null
    }
  }
}

// Analytics Service
export const analyticsService = {
  async getMonthlyRevenue() {
    try {
      return await getMonthlyRevenue()
    } catch (error) {
      console.error('Error fetching monthly revenue:', error)
      return []
    }
  },

  async getRoomStatusView() {
    try {
      return await getRoomStatusView()
    } catch (error) {
      console.error('Error fetching room status view:', error)
      return []
    }
  },

  async getRoomTypeRatings() {
    try {
      return await getRoomTypeRatings()
    } catch (error) {
      console.error('Error fetching room type ratings:', error)
      return []
    }
  }
}
