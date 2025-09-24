// Client-side data for components that run in the browser
// This file contains data synchronized with PostgreSQL database

export const roomTypes = [
  {
    id: "1",
    name: "Phòng Standard",
    slug: "phong-standard",
    basePrice: 1800000,
    capacity: 1,
    sizeSqm: 35,
    bedType: "2 Twin Beds",
    shortDesc: "Phòng tiêu chuẩn với 2 giường đơn, thiết kế hiện đại",
    longDesc: "Phòng Standard được thiết kế hiện đại với không gian 35m², trang bị đầy đủ tiện nghi cần thiết cho kỳ nghỉ thoải mái.",
    amenities: ["wifi", "breakfast", "non_smoking", "view"],
    policies: "Hủy miễn phí 48h trước check-in. Check-in 14:00, Check-out 12:00.",
    images: [
      "/images/z6716141210440_0c0b89f5840e67e029aace524aab11dc.jpg",
      "/images/z6716141199030_a21de5b69a0670805d420922de10281e.jpg"
    ],
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Phòng Deluxe",
    slug: "phong-deluxe",
    basePrice: 2500000,
    capacity: 2,
    sizeSqm: 45,
    bedType: "1 King Bed",
    shortDesc: "Phòng cao cấp với giường King, không gian rộng rãi",
    longDesc: "Phòng Deluxe mang đến trải nghiệm nghỉ dưỡng cao cấp với diện tích 45m².",
    amenities: ["wifi", "breakfast", "pool", "gym", "non_smoking", "view"],
    policies: "Hủy miễn phí 48h trước check-in. Check-in 14:00, Check-out 12:00.",
    images: [
      "/images/z6716141199063_6f2d15a14229f6fdff5f0d3c12871e39.jpg",
      "/images/z6716141199042_b665844bf13287706cba0013b8cb5c55.jpg"
    ],
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Phòng Twin Superior",
    slug: "phong-twin-superior",
    basePrice: 2300000,
    capacity: 2,
    sizeSqm: 40,
    bedType: "2 Twin Beds",
    shortDesc: "Phòng twin superior với 2 giường đơn, không gian thoải mái",
    longDesc: "Phòng Twin Superior được thiết kế với 2 giường đơn riêng biệt, phù hợp cho khách du lịch hoặc công tác.",
    amenities: ["wifi", "breakfast", "non_smoking", "view"],
    policies: "Hủy miễn phí 48h trước check-in. Check-in 14:00, Check-out 12:00.",
    images: [
      "/images/z6716141199070_8b5a8b5a8b5a8b5a8b5a8b5a8b5a8b5a8b.jpg",
      "/images/z6716141199080_9c6d9c6d9c6d9c6d9c6d9c6d9c6d9c6d9c.jpg"
    ],
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Phòng Executive Suite",
    slug: "phong-executive-suite",
    basePrice: 4200000,
    capacity: 2,
    sizeSqm: 75,
    bedType: "1 King Bed + Sofa Bed",
    shortDesc: "Phòng suite cao cấp với giường King và sofa bed",
    longDesc: "Phòng Executive Suite mang đến trải nghiệm nghỉ dưỡng cao cấp nhất với diện tích 75m², thiết kế sang trọng và hiện đại.",
    amenities: ["wifi", "breakfast", "pool", "spa", "gym", "non_smoking", "view", "minibar"],
    policies: "Hủy miễn phí 48h trước check-in. Check-in 14:00, Check-out 12:00.",
    images: [
      "/images/z6716141199070_8b5a8b5a8b5a8b5a8b5a8b5a8b5a8b5a8b.jpg",
      "/images/z6716141199080_9c6d9c6d9c6d9c6d9c6d9c6d9c6d9c6d9c.jpg"
    ],
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "15",
    name: "Phòng Test Exclusive Room",
    slug: "phong-test-exclusive-room",
    basePrice: 9900000,
    capacity: 2,
    sizeSqm: 0,
    bedType: "Twin",
    shortDesc: "Phòng test exclusive với giá cao cấp",
    longDesc: "Phòng Test Exclusive Room được thiết kế đặc biệt cho khách hàng VIP.",
    amenities: ["wifi", "breakfast", "pool", "spa", "gym", "non_smoking", "view", "minibar"],
    policies: "Hủy miễn phí 48h trước check-in. Check-in 14:00, Check-out 12:00.",
    images: [
      "/images/z6716141199070_8b5a8b5a8b5a8b5a8b5a8b5a8b5a8b5a8b.jpg"
    ],
    isPublished: true,
    updatedAt: new Date().toISOString(),
  },
]

export const rooms = [
  { id: "1", roomNumber: "201", floor: 2, roomTypeId: "1", status: "Occupied", updatedAt: "2025-09-12T04:54:46.402Z" },
  { id: "2", roomNumber: "202", floor: 2, roomTypeId: "1", status: "Occupied", updatedAt: "2025-09-11T03:53:21.004Z" },
  { id: "3", roomNumber: "203", floor: 2, roomTypeId: "1", status: "Occupied", updatedAt: "2025-09-11T07:39:31.046Z" },
  { id: "4", roomNumber: "204", floor: 2, roomTypeId: "1", status: "Occupied", updatedAt: "2025-09-11T07:39:34.768Z" },
  { id: "5", roomNumber: "205", floor: 2, roomTypeId: "1", status: "Maintenance", updatedAt: "2025-08-14T02:53:39.309Z" },
  { id: "6", roomNumber: "301", floor: 3, roomTypeId: "2", status: "Occupied", updatedAt: "2025-09-11T03:53:13.580Z" },
  { id: "7", roomNumber: "302", floor: 3, roomTypeId: "2", status: "Occupied", updatedAt: "2025-09-12T04:54:18.320Z" },
  { id: "8", roomNumber: "303", floor: 3, roomTypeId: "2", status: "Vacant", updatedAt: "2025-08-06T04:48:03.032Z" },
  { id: "9", roomNumber: "304", floor: 3, roomTypeId: "2", status: "Vacant", updatedAt: "2025-08-14T02:53:43.600Z" },
  { id: "10", roomNumber: "401", floor: 4, roomTypeId: "3", status: "Vacant", updatedAt: "2025-08-06T04:48:03.032Z" },
  { id: "11", roomNumber: "402", floor: 4, roomTypeId: "3", status: "Occupied", updatedAt: "2025-09-15T04:57:57.066Z" },
  { id: "12", roomNumber: "403", floor: 4, roomTypeId: "3", status: "Vacant", updatedAt: "2025-08-06T04:48:03.032Z" },
  { id: "13", roomNumber: "501", floor: 5, roomTypeId: "4", status: "Cleaning", updatedAt: "2025-09-12T06:43:52.992Z" },
  { id: "14", roomNumber: "502", floor: 5, roomTypeId: "4", status: "Vacant", updatedAt: "2025-08-06T04:48:03.032Z" },
  { id: "18", roomNumber: "503", floor: 5, roomTypeId: "4", status: "Vacant", updatedAt: "2025-09-12T02:58:01.253Z" },
]

export const customers = [
  { id: "1", fullName: "Test Updated Customer Updated", email: "test.updated@example.com", phone: "0987654321", createdAt: "2025-08-06T04:48:03.032Z", lastBookingAt: null, totalSpent: 0 },
  { id: "2", fullName: "Lê Hoàng Cường Bình", email: "tran.thi.binh@email.com", phone: "0912345678", createdAt: "2025-08-06T04:48:03.032Z", lastBookingAt: null, totalSpent: 0 },
  { id: "3", fullName: "Lê Hoàng Cường Bình", email: "le.hoang.cuong@email.com", phone: "0923456789", createdAt: "2025-08-06T04:48:03.032Z", lastBookingAt: null, totalSpent: 0 },
  { id: "4", fullName: "Phạm Thị Dung", email: "pham.thi.dung@email.com", phone: "0934567890", createdAt: "2025-08-06T04:48:03.032Z", lastBookingAt: null, totalSpent: 0 },
  { id: "5", fullName: "John Smith", email: "john.smith@email.com", phone: "+1234567890", createdAt: "2025-08-06T04:48:03.032Z", lastBookingAt: null, totalSpent: 0 },
  { id: "6", fullName: "Duy Luong Hoang", email: "duy.luonghoang.work@gmail.com", phone: "0984821037", createdAt: "2025-09-10T07:30:00.000Z", lastBookingAt: null, totalSpent: 0 },
  { id: "7", fullName: "Lương Duy", email: "duy.ac.tb@gmail.com", phone: "0984821037", createdAt: "2025-09-11T03:10:00.000Z", lastBookingAt: null, totalSpent: 0 },
  { id: "8", fullName: "Thiên Hoàng Minh", email: "thminht@gmail.com", phone: "0832321948", createdAt: "2025-09-16T03:23:51.414Z", lastBookingAt: null, totalSpent: 0 },
]

export const bookings = [
  { id: "BK2025896317974", customerId: "6", checkIn: "2025-10-16T17:00:00.000Z", checkOut: "2025-11-17T17:00:00.000Z", nights: 32, roomTypeId: "2", roomsCount: 1, guestsAdult: 1, guestsChild: 0, totalAmount: 68000000, status: "New", createdAt: "2025-09-16T03:23:51.414Z", updatedAt: "2025-09-16T03:23:51.414Z" },
  { id: "BK2025029180858", customerId: "8", checkIn: "2025-09-16T17:00:00.000Z", checkOut: "2025-09-17T17:00:00.000Z", nights: 1, roomTypeId: "1", roomsCount: 1, guestsAdult: 1, guestsChild: 0, totalAmount: 1980000, status: "New", createdAt: "2025-09-16T03:23:51.414Z", updatedAt: "2025-09-16T03:23:51.414Z" },
  { id: "BK2025008", customerId: "7", checkIn: "2025-09-11T17:00:00.000Z", checkOut: "2025-09-12T17:00:00.000Z", nights: 1, roomTypeId: "4", roomsCount: 1, guestsAdult: 1, guestsChild: 0, totalAmount: 4620000, status: "Completed", createdAt: "2025-09-11T03:10:00.000Z", updatedAt: "2025-09-11T03:10:00.000Z" },
  { id: "BK2025007", customerId: "6", checkIn: "2025-10-13T17:00:00.000Z", checkOut: "2025-10-28T17:00:00.000Z", nights: 15, roomTypeId: "3", roomsCount: 1, guestsAdult: 1, guestsChild: 0, totalAmount: 36300000, status: "Confirmed", createdAt: "2025-09-10T07:30:00.000Z", updatedAt: "2025-09-10T07:30:00.000Z" },
  { id: "BK2025006", customerId: "6", checkIn: "2025-09-10T17:00:00.000Z", checkOut: "2025-09-11T17:00:00.000Z", nights: 1, roomTypeId: "2", roomsCount: 1, guestsAdult: 1, guestsChild: 0, totalAmount: 2750000, status: "Confirmed", createdAt: "2025-09-10T07:30:00.000Z", updatedAt: "2025-09-10T07:30:00.000Z" },
  { id: "BK2024002", customerId: "2", checkIn: "2024-02-19T17:00:00.000Z", checkOut: "2024-02-24T17:00:00.000Z", nights: 5, roomTypeId: "4", roomsCount: 1, guestsAdult: 2, guestsChild: 0, totalAmount: 18480000, status: "Completed", createdAt: "2025-08-06T04:48:03.032Z", updatedAt: "2025-08-06T04:48:03.032Z" },
  { id: "BK2024005", customerId: "5", checkIn: "2024-02-29T17:00:00.000Z", checkOut: "2024-03-04T17:00:00.000Z", nights: 4, roomTypeId: "2", roomsCount: 1, guestsAdult: 2, guestsChild: 0, totalAmount: 8800000, status: "Confirmed", createdAt: "2025-08-06T04:48:03.032Z", updatedAt: "2025-08-06T04:48:03.032Z" },
  { id: "BK2024003", customerId: "3", checkIn: "2024-02-09T17:00:00.000Z", checkOut: "2024-02-11T17:00:00.000Z", nights: 2, roomTypeId: "1", roomsCount: 1, guestsAdult: 2, guestsChild: 0, totalAmount: 3960000, status: "Confirmed", createdAt: "2025-08-06T04:48:03.032Z", updatedAt: "2025-08-06T04:48:03.032Z" },
  { id: "BK2024001", customerId: "1", checkIn: "2024-02-14T17:00:00.000Z", checkOut: "2024-02-17T17:00:00.000Z", nights: 3, roomTypeId: "2", roomsCount: 1, guestsAdult: 2, guestsChild: 0, totalAmount: 8250000, status: "Cancelled", createdAt: "2025-08-06T04:48:03.032Z", updatedAt: "2025-08-06T04:48:03.032Z" },
  { id: "BK2024004", customerId: "4", checkIn: "2024-02-24T17:00:00.000Z", checkOut: "2024-02-27T17:00:00.000Z", nights: 3, roomTypeId: "3", roomsCount: 1, guestsAdult: 2, guestsChild: 0, totalAmount: 12342000, status: "Cancelled", createdAt: "2025-08-06T04:48:03.032Z", updatedAt: "2025-08-06T04:48:03.032Z" },
]

