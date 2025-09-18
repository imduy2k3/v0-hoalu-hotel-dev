// This file now exports database service functions instead of hardcoded data
// The actual data is fetched from PostgreSQL database in real-time

export { 
  roomTypesService,
  roomsService,
  customersService,
  bookingsService,
  servicesService,
  promotionsService,
  reviewsService,
  systemSettingsService,
  analyticsService
} from './data-service'

// Legacy exports for backward compatibility (will be removed gradually)
import { roomTypesService, roomsService, customersService, bookingsService } from './data-service'

// These functions provide the same interface as the old hardcoded arrays
// but fetch data from the database instead
export const getRoomTypes = () => roomTypesService.getAll()
export const getRooms = () => roomsService.getAll()
export const getCustomers = () => customersService.getAll()
export const getBookings = () => bookingsService.getAll()

// For components that still expect arrays, we can provide these as fallbacks
// but they should be updated to use the service functions directly
export const roomTypes = [] // Will be populated by components using getRoomTypes()
export const rooms = [] // Will be populated by components using getRooms()
export const customers = [] // Will be populated by components using getCustomers()
export const bookings = [] // Will be populated by components using getBookings()
