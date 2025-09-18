import type { RoomType, Room, Booking, Customer } from "./types"

export const roomTypes: RoomType[] = [
  {
    id: "1",
    name: "Standard",
    slug: "standard",
    basePrice: 800000,
    capacity: 2,
    sizeSqm: 25,
    bedType: "Twin",
    shortDesc: "Phòng tiêu chuẩn với 2 giường đơn, thiết kế hiện đại",
    longDesc:
      "Phòng Standard được thiết kế hiện đại với không gian 25m², trang bị đầy đủ tiện nghi cần thiết cho kỳ nghỉ thoải mái. Phòng có 2 giường đơn, cửa sổ lớn với tầm nhìn đẹp ra thành phố.",
    amenities: ["wifi", "breakfast", "non_smoking", "view"],
    policies: "Hủy miễn phí 48h trước check-in. Check-in 14:00, Check-out 12:00.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/z6716141210440_0c0b89f5840e67e029aace524aab11dc.jpg-F7gjiZubQFjwc5KaN7IFhWoS4pDtfT.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/z6716141199030_a21de5b69a0670805d420922de10281e.jpg-5sPqzB3Ggtb7oZG631sbO53Es3Yly7.jpeg",
    ],
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Deluxe",
    slug: "deluxe",
    basePrice: 1200000,
    capacity: 3,
    sizeSqm: 35,
    bedType: "Queen",
    shortDesc: "Phòng cao cấp với giường Queen, không gian rộng rãi",
    longDesc:
      "Phòng Deluxe mang đến trải nghiệm nghỉ dưỡng cao cấp với diện tích 35m². Phòng được trang bị giường Queen size, khu vực làm việc riêng biệt và ban công với tầm nhìn panorama.",
    amenities: ["wifi", "breakfast", "pool", "gym", "non_smoking", "view"],
    policies: "Hủy miễn phí 48h trước check-in. Check-in 14:00, Check-out 12:00.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/z6716141199063_6f2d15a14229f6fdff5f0d3c12871e39.jpg-a1Hevaue5bdaYWtFYMuse4IehSY0ZT.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/z6716141199042_b665844bf13287706cba0013b8cb5c55.jpg-RDbuC4v3SY6rg6HOne4YpfrXC4zxkQ.jpeg",
    ],
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Suite",
    slug: "suite",
    basePrice: 2000000,
    capacity: 4,
    sizeSqm: 50,
    bedType: "King",
    shortDesc: "Phòng suite sang trọng với giường King và phòng khách riêng",
    longDesc:
      "Suite là lựa chọn hoàn hảo cho những ai tìm kiếm sự sang trọng tuyệt đối. Với diện tích 50m², phòng có giường King size, phòng khách riêng biệt, minibar và tầm nhìn tuyệt đẹp ra cố đô Hoa Lư.",
    amenities: ["wifi", "breakfast", "pool", "spa", "airport_pickup", "gym", "parking", "non_smoking", "view"],
    policies: "Hủy miễn phí 48h trước check-in. Check-in 14:00, Check-out 12:00.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/z6716141199052_bbf0e2874f80f5c2b042b1eaae3b536f.jpg-kLfzczcZj8ulS3vNV4MbCPtgsXAJlB.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/z6716141199063_6f2d15a14229f6fdff5f0d3c12871e39.jpg-a1Hevaue5bdaYWtFYMuse4IehSY0ZT.jpeg",
    ],
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
]

export const rooms: Room[] = [
  { id: "1", roomNumber: "101", floor: 1, roomTypeId: "1", status: "Vacant", updatedAt: new Date().toISOString() },
  { id: "2", roomNumber: "102", floor: 1, roomTypeId: "1", status: "Vacant", updatedAt: new Date().toISOString() },
  { id: "3", roomNumber: "201", floor: 2, roomTypeId: "2", status: "Occupied", updatedAt: new Date().toISOString() },
  { id: "4", roomNumber: "202", floor: 2, roomTypeId: "2", status: "Vacant", updatedAt: new Date().toISOString() },
  { id: "5", roomNumber: "301", floor: 3, roomTypeId: "3", status: "Vacant", updatedAt: new Date().toISOString() },
]

export const customers: Customer[] = [
  {
    id: "1",
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0901234567",
    createdAt: "2024-01-15T10:00:00Z",
    lastBookingAt: "2024-03-10T14:30:00Z",
    totalSpent: 2400000,
  },
  {
    id: "2",
    fullName: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    phone: "0912345678",
    createdAt: "2024-02-20T09:15:00Z",
    lastBookingAt: "2024-03-15T16:45:00Z",
    totalSpent: 1600000,
  },
]

export const bookings: Booking[] = [
  {
    id: "HLH001",
    customerId: "1",
    checkIn: "2024-03-20T14:00:00Z",
    checkOut: "2024-03-22T12:00:00Z",
    nights: 2,
    roomTypeId: "2",
    roomsCount: 1,
    guestsAdult: 2,
    guestsChild: 0,
    totalAmount: 2400000,
    status: "Confirmed",
    createdAt: "2024-03-10T14:30:00Z",
    updatedAt: "2024-03-10T14:30:00Z",
  },
  {
    id: "HLH002",
    customerId: "2",
    checkIn: "2024-03-25T14:00:00Z",
    checkOut: "2024-03-27T12:00:00Z",
    nights: 2,
    roomTypeId: "1",
    roomsCount: 1,
    guestsAdult: 2,
    guestsChild: 0,
    totalAmount: 1600000,
    status: "New",
    createdAt: "2024-03-15T16:45:00Z",
    updatedAt: "2024-03-15T16:45:00Z",
  },
]
