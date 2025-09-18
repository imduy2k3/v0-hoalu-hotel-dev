export type Amenity =
  | "wifi"
  | "breakfast"
  | "pool"
  | "spa"
  | "airport_pickup"
  | "gym"
  | "parking"
  | "non_smoking"
  | "view"

export interface RoomType {
  id: string
  name: string // "Deluxe", "Suite", "Standard"
  slug: string // "deluxe", ...
  basePrice: number // price per night (VND)
  capacity: number // max guests
  sizeSqm: number
  bedType: "Queen" | "King" | "Twin"
  shortDesc: string
  longDesc: string
  amenities: Amenity[]
  policies?: string
  images: string[]
  isPublished: boolean
  updatedAt: string // ISO
}

export type RoomStatus = "Vacant" | "Occupied" | "Maintenance" | "Locked"

export interface Room {
  id: string
  roomNumber: string // "201"
  floor?: number
  roomTypeId: string
  status: RoomStatus
  notes?: string
  updatedAt: string
}

export type BookingStatus = "New" | "Confirmed" | "Cancelled" | "Completed"

export interface Booking {
  id: string // code
  customerId: string
  checkIn: string // ISO date
  checkOut: string // ISO date
  nights: number
  roomTypeId: string
  roomsCount: number
  guestsAdult: number
  guestsChild: number
  totalAmount: number // computed
  status: BookingStatus
  note?: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  fullName: string
  email: string
  phone: string
  createdAt: string
  lastBookingAt?: string
  totalSpent?: number
}

export interface User {
  id: string
  email: string
  role: "Owner" | "Staff"
  fullName: string
}
